

var Quran = {};

Quran.quranObj = null;
Quran.MOUSE_ON_RESULT_LIST = false;


Quran.loadAyat = function () {
    return $.ajax({
        url: BASE_URL+"/js/json/quran.json",
        type: 'GET',
        success: function (data, textStatus, jqXHR) {
            Quran.quranObj = data;
        }
    });
};

Quran.insert = function (aya){
    
    aya = $.trim(aya);
    
    var cursorPosition = quill.getSelection() ?quill.getSelection().index : quill.getLength();
    if($.trim(aya).length <= 1){
        return ;
    }
    var ayaLen = aya.length ;
   
   
    quill.insertText(cursorPosition , ' ', Quill.sources.API);
    
    quill.insertEmbed(cursorPosition  + 1, 
        'AyaQuran', {
        sura: 1,
        aya: 1,
        text:aya,
        formatClass:"aya-quran"
    });
    
    
        
    quill.insertText(cursorPosition + ayaLen + 1, ' .', Quill.sources.API);
    quill.setSelection(cursorPosition + ayaLen  + 3, Quill.sources.API);
   
    
   /* quill.insertEmbed(cursorPosition + ayaLen  +4, 
        'Sadak-Allah', {
        text:"صدق الله",
        formatClass:"sadak-allah"
    });
    quill.insertText(cursorPosition  + ayaLen + 5 , ' ', Quill.sources.API);*/
    
};

Quran.searchBox = function (){
    
    if($("#quran-container .tooltip-container").length > 0){
        $("#quran-container .tooltip-container").fadeOut(function (){
            $(this).remove();
        });
    }else{
        
        var box = ` <div class="tooltip-container">
                        <div class="arrow"></div>
                        <div class="content-wrapper">
                            <div class="seach-input-wrapper"> 
                                <input id="quran-search-input" type="text" placeholder="ابحث عن اية">
                                <div id="quran-search-result" class="result"><ul style="display: none;"></ul></div>
                            </div>
                            <div id="ayat-review">
                                <div class="aya-wrapper">
                                </div>
                            </div>
                            <hr>
                            <div id="ayat-actions">
                                <div class="upper">
                                    <button class="add-aya pull-l btn" data-action="add">
                                        <label></label>
                                    </button>
                                    <button class="remove-aya pull-r btn" data-action="remove">
                                        <label></label>
                                    </button>
                                </div>
                                <div class="down">
                                    <button id="add-ayat-answer" class="add-ayat">اضف الى المقال</button>
                                </div>
                            </div>
                        </div>
                    </div>`;
        
        $("#quran-container").append(box);
        $("#quran-container .tooltip-container").css({
            top: $("#quran-container").offset().top + 40,
            left: $("#quran-container").offset().left -25
        });
    }
    
    
};
Quran.unifyChar = function (text){
    
    text = text.replace(/(آ|إ|أ)/g, 'ا');
    text = text.replace(/(ة)/g, 'ه');
    text = text.replace(/(ئ|ؤ)/g, 'ء');
    text = text.replace(/(ى)/g, 'ي');
    return text;  
};

Quran.normalizeText = function (text){
    
    text = text.replace(/q|Q/g, 'ض');
    text = text.replace(/w|W/g, 'ص');
    text = text.replace(/e|E/g, 'ث');
    text = text.replace(/r|R/g, 'ق');
    text = text.replace(/t|T/g, 'ف');
    text = text.replace(/y|Y/g, 'غ');
    text = text.replace(/u|U/g, 'ع');
    text = text.replace(/i|I/g, 'ه');
    text = text.replace(/o|O/g, 'خ');
    text = text.replace(/p|P/g, 'ح');
    text = text.replace(/\[/g , 'ج');
    text = text.replace(/\]/g , 'د');
    text = text.replace(/a|A/g, 'ش');
    text = text.replace(/s|S/g, 'س');
    text = text.replace(/d|D/g, 'ي');
    text = text.replace(/f|F/g, 'ب');
    text = text.replace(/g|G/g, 'ل');
    text = text.replace(/h|H/g, 'ا');
    text = text.replace(/j|J/g, 'ت');
    text = text.replace(/k|K/g, 'ن');
    text = text.replace(/l|L/g, 'م');
    text = text.replace(/;/g  , 'ك');
    text = text.replace(/'/g  , 'ط');
    text = text.replace(/z|Z/g, 'ئ');
    text = text.replace(/x|X/g, 'ء');
    text = text.replace(/c|C/g, 'ؤ');
    text = text.replace(/v|V/g, 'ر');
    text = text.replace(/b|B/g, 'لا');
    text = text.replace(/n|N/g, 'ى');
    text = text.replace(/m|M/g, 'ة');
    text = text.replace(/,/g  , 'و');
    text = text.replace(/\./g , 'ز');
    text = text.replace(/\//g , 'ظ');
    text = text.replace(/`/g , 'ذ');
    
    text = text.replace(/([^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z 0-9])/g, '');

    //normalize Arabic
    text = Quran.unifyChar(text);

    //convert arabic numerals to english counterparts.
    var starter = 0x660;
    for (var i = 0; i < 10; i++) {
      text.replace(String.fromCharCode(starter + i), String.fromCharCode(48 + i));
    }

    return text;
};

Quran.searchByAyaTxt = function (ayaTxt){
  
    return $.ajax({
        
        url:BASE_URL+"/api/Quran/search",
        data:{
            
            QURAN_SEARCH:true,
            ayaTxt: Quran.normalizeText(ayaTxt)         
        },
        beforeSend: function (xhr) {
            
        },
        success: function (data, textStatus, jqXHR) {
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
        
    });
    
};


$(document).on("keydown focus", "#quran-search-input", function (){
   
    var ayaPart = $(this).val();
    
    if(ayaPart.length <= 1){
        return ;
    }
    
    var loader = ` <ul>
                        <li>
                            <img src="image/infLoader.svg" class="loader-inf"/>
                        </li>
                    </ul>`;
    
    
    $("#quran-search-result").html(loader);
    
    Quran.searchByAyaTxt(ayaPart).done(function (data){
        
        if(isJson(data)){
            var jsonData = JSON.parse(data);
        }else{
            alert(data);
            return ;
        }
        
        var list = "";
        
        if(jsonData.length > 0){
            
            for(var iii in jsonData){
            
            list += `
                        <li data-aya-index="${jsonData[iii].aya}" data-sura-index="${jsonData[iii].sura}" data-sura-name="${jsonData[iii].sura_name}">
                            <div class="text">${jsonData[iii].aya_text}</div>
                            <div class="label">
                                <label>${jsonData[iii].sura_name} ﴿${jsonData[iii].aya}﴾</label>
                            </div>
                        </li>`;

            }
            
        }else{
            
            list = `<li>
                        <div> لا توجد اية تحمل هذة الحروف..</div>
                    </li>`;
            
        }
        
        $("#quran-search-result").html(`<ul>${list}</ul>`);
            
    });
    
});

$(document).on("blur" , "#quran-search-input" , function (){
    if(!Quran.MOUSE_ON_RESULT_LIST){
        $("#quran-search-result").empty();
    }
});


$(document).on("mouseenter" , "#quran-search-result ul", function (){Quran.MOUSE_ON_RESULT_LIST = true;});
$(document).on("mouseleave" , "#quran-search-result ul", function (){Quran.MOUSE_ON_RESULT_LIST = false;});

$(document).on("click" , "#ayat-review .add-aya", function (){
    $("#ayat-actions .add-aya").click();
});
$(document).on("click" , "#ayat-review .remove-aya", function (){
    $("#ayat-actions .remove-aya").click();
});
$(document).on("click" , "#ayat-actions .add-aya, #ayat-actions .remove-aya", function (){
    
    var ayaStart = $("#ayat-review p").attr("data-aya-start") || 1;
    var ayaEnd   = $("#ayat-review p").attr("data-aya-end") || 1;
    var sura     = $("#ayat-review p").attr("data-sura") || 1;
    var self     = $(this);
    var selfHtml = $(this).html();
    var action   = $(this).attr("data-action") || "add";
    
    
    $.ajax({
        url: BASE_URL+"/api/Quran/getAya",
        data: {
            
            GET_AYA_FROM_TO: true,
            ayaStart       : ayaStart,
            ayaEnd         : ayaEnd,
            sura           :sura,
            action         :action
        },
        type: 'GET',
        beforeSend: function (xhr) {
            
            $("#ayat-actions .add-aya").attr("disabled", "disabled");
            $("#ayat-actions .remove-aya").attr("disabled", "disabled");
            self.html(`<img src="${BASE_URL}/image/infLoader.svg" class="loader-inf"/>`);
            
        },
        success: function (data, textStatus, jqXHR) {
            
            self.html(selfHtml);
            $("#ayat-actions .add-aya").removeAttr("disabled");
            $("#ayat-actions .remove-aya").removeAttr("disabled");
            
            
            if(isJson(data)){
                var jsonData = JSON.parse(data);
            }else{
                alert(data);
                return ;
            }
            
            if(jsonData.state === "invalid-sura"){
                alert("خطاء السورة");
                return ;
            }
            
            
            var ayat = jsonData.ayat;
            var ayatString = "";
            
            for(var iii in ayat){
                
                ayatString += ayat[iii].aya_text;
                
                if(iii <  ayat.length - 1){
                    ayatString += `  ﴿${getArabicNumbers(ayat[iii].aya)}﴾ `;
                }
                
            }
            
            $("#ayat-review p .txt").html(ayatString);
            $("#ayat-review p").attr("data-aya-start" , jsonData.start);
            $("#ayat-review p").attr("data-aya-end" , jsonData.end);
            
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    });
    
});




$(document).on("click" , "#quran-search-result ul li", function (){
    
    var suraIndex = $(this).attr("data-sura-index");
    var ayaIndex  = $(this).attr("data-aya-index");
    var suraName  = $(this).attr("data-sura-name");
    
    var reviewBox = `
                    <div class="top-fram"></div>
                    <div class="main-fram">
                        <div class="header">
                            <div class="header-wrapper">
                                <h1>${suraName}</h1>
                            </div>
                            <div>
                                <h2>بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ</h2>
                            </div>
                        </div>
                        <p class="rtl" data-aya-start="2" data-aya-end="12" data-sura="20">
                            <label class="txt">${$.trim($(this).children(".text").text())}</label>
                            &nbsp;&nbsp;
                            <button class="add add-aya"></button>
                            <button class="remove remove-aya"></button>
                        </p>
                    </div>
                    <div class="bottom-fram"></div>`;
    
    $("#ayat-review .aya-wrapper").html(reviewBox);
    $("#ayat-review p").attr("data-aya-start" , ayaIndex);
    $("#ayat-review p").attr("data-aya-end" , ayaIndex);
    $("#ayat-review p").attr("data-sura" , suraIndex);
    $("#quran-search-result").children().fadeOut(function (){
        $(this).empty();
    });
});


$(document).on("click" , "#add-ayat-answer", function (){
    
    var part = $.trim( $("#ayat-review p .txt").text());
    Quran.insert(part);
    $("#insert-aya").trigger("click");
});