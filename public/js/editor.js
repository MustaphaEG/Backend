var icons      = Quill.import('ui/icons'); 
var AlignClass = Quill.import('attributors/class/align');
var Inline     = Quill.import('blots/inline');
var Tooltip    = Quill.import('ui/tooltip');
var Embed      = Quill.import('blots/embed');
var Delta      = Quill.import('delta');
const  EDITOR_MAX_LEGNTH = 125000;

AlignClass.whitelist = [
    "left",
    "center",
    "right"
];

icons.align.left = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=3 x2=15 y1=9 y2=9></line> <line class=ql-stroke x1=3 x2=13 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=9 y1=4 y2=4></line> </svg>";


class Counter {
    
    constructor(quill, options) {
      this.quill = quill;
      this.options = options;
      this.container = $(options.container);
      quill.on('text-change', this.update.bind(this));
      this.update();  // Account for initial contents
    }

    calculate() {
      let text = this.quill.getText();
      
        text = text.trim();
        // Splitting empty text returns a non-empty array
        return  {
          words:   (text.length > 0 ? text.split(/\s+/).length : 0),
          char: text.length
        };
     
    }

    update() {
      var length = this.calculate();
      var label = this.options.unit;
      if(length.char > EDITOR_MAX_LEGNTH){
          quill.deleteText(EDITOR_MAX_LEGNTH , quill.getLength());
      }
      this.container.html( ` ${length.words} كلمة &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    ${length.char} حرف `);
    }
}

class MentionBlot extends Embed {

  static create(data) {
      
    const node = super.create(data.name);
    node.innerHTML = data.name;
    node.setAttribute('spellcheck', "false");
    node.setAttribute('autocomplete', "off");
    node.setAttribute('autocorrect', "off");
    node.setAttribute('autocapitalize', "off");

    // store data
    node.setAttribute('data-user-name', data.name);
    node.setAttribute('data-user-id', data.id);
    return node;
  }

  static value(domNode) {
    const { name, id } = domNode.dataset;
    return { name, id };
  }

  constructor(domNode, value) {
    super(domNode);
    this._data = value;
    this._removedBlot = false;
  }

  // eslint-disable-next-line no-unused-vars
  index(node, offset) {
    // See leaf definition as reference:
    // https://github.com/quilljs/parchment/blob/master/src/blot/abstract/leaf.ts
    // NOTE: sometimes `node` contains the actual dom node and sometimes just
    // the text
    return 1;
  }

  /**
   * Replace the current Mention Blot with the given text.
   *
   * @param { String } text the text to replace the mention with.
   */
  _replaceBlotWithText(text) {
    // The steps to replace the Blot with its text must be in this order:
    // 1. insert text - source:API
    //    using API we won't react to changes
    // 2. set selection - source:API
    //    set the cursor position in place
    // 3. remove blot - source:USER
    //    using USER we react to the text-change event and it "looks" like we
    //    did a blot->text replacement in one step.
    //
    // If we don't do these actions in the specified order, the text update and
    // the cursor position won't be as it should for the autocompletion list.

    if (this._removedBlot) return;
    this._removedBlot = true;

    const cursorPosition = quill.getSelection().index;
    const blotCursorPosition = quill.selection.getNativeRange().end.offset;
    const realPosition = cursorPosition + blotCursorPosition;

    quill.insertText(cursorPosition - 1, text, Quill.sources.API);
    quill.setSelection(realPosition - 1, Quill.sources.API);
    quill.deleteText(cursorPosition + text.length - 1, 1, Quill.sources.USER);

    // We use API+USER to be able to hook just USER from the outside and the
    // content edit will look like is done in "one action".
  }

  changeText(oldText, newText) {
      
    const name = this._data.name;

    const valid = (oldText == name) && (newText != oldText);
    if (!valid) return;

    let cursorPosition = quill.getSelection().index;
    if (cursorPosition == -1) {
      // This case was found just a couple of times and it may not appear again
      // due to improvements made on the MentionBlot. I'm leaving the fix here
      // in case that happens again to debug it.
      cursorPosition = 1;
      console.warning("[changeText] cursorPosition was -1 ... changed to 1");
    }

    const blotCursorPosition = quill.selection.getNativeRange().end.offset;
    let realPosition = cursorPosition;

    if (!this._removedBlot) {
      realPosition += blotCursorPosition;
    } else {
      // Right after the blot is removed we may need to handle a Mutation.
      // If that's the case, considering that the length of the text is 1 would
      // be wrong since it no longer is an Embed but a text.
      console.warning("[changeText] removedBlot is set!");
    }

    if (newText.startsWith(name) && oldText == name) { // append
      // An append happens as follows:
      // Text: <@Name|> -> <@NameX|>
      // We need to move the inserted letter X outside the blot.
      const extra = newText.substr(name.length);

      this.domNode.innerHTML = name;

      // append the text outside the blot
      quill.insertText(cursorPosition, extra, Quill.sources.USER);
      quill.setSelection(cursorPosition + extra.length, Quill.sources.API);
      // quill.insertText(cursorPosition + 2, extra, Quill.sources.USER);
      // quill.setSelection(cursorPosition + extra.length + 3, Quill.sources.API);

      return;
    } else if (newText.endsWith(name) && oldText == name) { // prepend
      // A prepend may be handled in two different ways depending on the
      // browser and the text/cursor state.
      //
      // Case A: (not a problem)
      // Text: |<@Name> -> X|<@Name>
      // Case B: (problem)
      // Text: <|@Name> -> <X|@Name>
      //
      // If we reach this point, it means that we need to tackle Case B.
      // We need to move the inserted letter X outside the blot.
      const end = newText.length - name.length;
      const extra = newText.substr(0, end);

      // The cursor position is set right after the inserted character.
      // In some cases the cursor position gets updated before the text-edit
      // event is emited and in some cases afterwards.
      // This difference manifests itself when the Blot is at the beginning and
      // this conditional assignment handles the issue.
      const pos = cursorPosition > 0 ? cursorPosition - 1 : cursorPosition;

      this.domNode.innerHTML = name;

      // append the text outside the blot
      quill.insertText(pos, extra, Quill.sources.USER);
      quill.setSelection(pos + extra.length, Quill.sources.API);

      return;
    }
    // no append, no prepend, text has changed in a different way.

    // We need to trigger these changes right after the update callback
    // finishes, otherwise errors may appear due to ranges not updating
    // correctly.
    // See: https://github.com/quilljs/quill/issues/1134
    setTimeout(() => this._replaceBlotWithText(newText), 0)
  }

  update(mutations) {
    // See as reference:
    // https://github.com/quilljs/quill/blob/develop/blots/cursor.js

    mutations
      .filter(mutation => mutation.type == 'characterData')
      .forEach(m => {
        const oldText = m.oldValue;
        const newText = m.target.data;
        this.changeText(oldText, newText);
      });

    // I'm not sure whether this is needed or not, keeping it just in case.
    super.update(mutations.filter(mutation => mutation.type != 'characterData'));
  }

}

MentionBlot.blotName = 'mention';
MentionBlot.className = 'quill-mention';
MentionBlot.tagName = 'span';



class AyaQuran extends Inline {
    
  static create(aya) {
    
    let node = super.create(aya);
    if (aya) {
        node.setAttribute('class', aya.formatClass);
        node.setAttribute('data-sura', aya.sura);
        node.setAttribute('data-aya', aya.aya);
        node.appendChild(document.createTextNode(aya.text));
    }
    
    return node;
  }

  static formats(domNode) {
      
    return domNode.getAttribute("class");
  }

  format(name, value) {
      console.log(name, value)
    if (name !== this.statics.blotName || !value) return super.format(name, value);
    if (value){
      this.domNode.setAttribute('class', value);
    }
  }
};
AyaQuran.blotName = 'AyaQuran';
AyaQuran.tagName = 'span';


class BsmEllah extends Embed {
    
  static create(bsm) {
    
    let node = super.create(bsm);
    if (bsm) {
        node.setAttribute('class', bsm.formatClass);
        node.appendChild(document.createTextNode(bsm.text));
    }
    
    return node;
  }

  static formats(domNode) {
      
    return domNode.getAttribute("class");
  }

  format(name, value) {
      
    if (name !== this.statics.blotName || !value) return super.format(name, value);
    if (value){
      this.domNode.setAttribute('class', value);
    }
  }
};
BsmEllah.blotName = 'Bsm-Ellah';
BsmEllah.tagName = 'span';


class SadakAllah extends Embed {
    
  static create(bsm) {
    
    let node = super.create(bsm);
    if (bsm) {
        node.setAttribute('class', bsm.formatClass);
        node.appendChild(document.createTextNode(bsm.text));
    }
    
    return node;
  }

  static formats(domNode) {
      
    return domNode.getAttribute("class");
  }

  format(name, value) {
      
    if (name !== this.statics.blotName || !value) return super.format(name, value);
    if (value){
      this.domNode.setAttribute('class', value);
    }
  }
};
SadakAllah.blotName = 'Sadak-Allah';
SadakAllah.tagName = 'span';


Quill.register(AyaQuran);
Quill.register(MentionBlot);
Quill.register('modules/counter', Counter);


var AllEditors = {};
AllEditors.editorArr = [];
class QEditor{
    
    constructor(containers){
        var _this = this;
        this.change = new Delta();
        this.editor = this.creatEditor(containers);
        this.editor.theme.tooltip.boundsContainer = $(containers.editor)[0];
        this.editor.on('text-change', function(delta){
            _this.change = _this.change.compose(delta);
        });
        this.containers = containers;
        AllEditors.editorArr.push({
            editor : _this,
            idEditor: containers.editorId
        });
    }
    
    creatEditor(containers){
        
        return (new Quill(containers.editor, {
                    modules: {
                        formula: true,
                        syntax: true,
                        toolbar: {
                            container: containers.toolBar,
                            handlers: {
                              'quran': Quran.searchBox
                            }
                        },
                        counter: {
                            container: containers.counter,
                            unit: 'حرف'
                        }
                    },
                    placeholder: 'اكتب اجابة منسقة ....',
                    theme: 'snow'
                }));
    }
    
    saveDraft (){
        var containers = this.containers;
        $((containers.downEditor + " .draft-state")).html("جار الحفظ...");
        $((containers.downEditor + " .save-btn")).html(`<img class="inf-loader" src="${BASE_URL+"/image/infLoader.svg"}"/>`);

        $.ajax({
            url: BASE_URL+"/api/Editor/saveDraft",
            data:{
                doc: JSON.stringify(this.editor.getContents())
            },
            type: 'POST',
            beforeSend: function (xhr) {

            },
            success: function (data, textStatus, jqXHR) {
                $((containers.downEditor + " .draft-state")).html("تم الحفظ");
                $((containers.downEditor + " .save-btn")).html(`حفظ كمسودة`);

                if(isJson(data)){
                    var jsonData = JSON.parse(data);
                }else{
                    return ;
                }

                if(jsonData.state === "ok"){

                }else{
                    localStorage.setItem("LAST_DRAFT" , JSON.stringify(quill.getContents()));
                    console.log(data);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {

            }

    });
};
    
    
    
    
}


/*
var TooltipFormula    = quill.theme.tooltip;
TooltipFormula.boundsContainer = $("#editor")[0];*/
/*

var enableMathQuillFormulaAuthoring = mathquill4quill();
enableMathQuillFormulaAuthoring(quill);
*/

 



/*
var tt = {"ops":[{"insert":"سطر علية خط \n function test()"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"{"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"  var h = \"mostafe\";"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"  $test = 'nor';"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"  return tat;"},{"attributes":{"code-block":true},"insert":"\n\n"},{"insert":"}"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"this is blackcote "},{"attributes":{"align":"left","blockquote":true},"insert":"\n"},{"insert":"sfddf f"},{"attributes":{"align":"left","list":"ordered"},"insert":"\n"},{"insert":"sdf"},{"attributes":{"align":"left","list":"ordered"},"insert":"\n"},{"insert":"sdf"},{"attributes":{"align":"left","list":"bullet"},"insert":"\n"},{"insert":{"formula":"e\\ =\\ mc^2"}},{"insert":" "},{"attributes":{"align":"left"},"insert":"\n"},{"attributes":{"link":"www.elkaisar.com"},"insert":"asdasdsad "},{"attributes":{"align":"left"},"insert":"\n\n"}]};

quill.setContents(tt);*/
/*
var change = new Delta();









*/

if($("#editor").length > 0){
   var quill = (new QEditor({
                editor: "#editor",
                downEditor: "#down-editor",
                counter: "#counter",
                toolBar :"#toolbar-container",
                editorId: "Global"
            })).editor; 
}


setInterval(function() {
    
    for(var iii in AllEditors.editorArr ){
        if (AllEditors.editorArr[iii].editor.change.length() > 0) {
            AllEditors.editorArr[iii].editor.saveDraft();
            AllEditors.editorArr[iii].editor.change = new Delta();
        }
    }
  
}, 10*1000);




AllEditors.getEditor = function (idEditor)
{
    for(var iii in AllEditors.editorArr ){
        if (AllEditors.editorArr[iii].idEditor ===  idEditor) {
            return AllEditors.editorArr[iii];
        }
    }
    
    return false;
};