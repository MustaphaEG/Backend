
var Tag = {};

Tag.search =  function (freg , tags){
    
    
    return  $.ajax({
        url: BASE_URL+"/api/Tag/saerch",
        data:{
            freg: freg,
            tags: JSON.stringify(tags)
        },
        type: 'GET',
        beforeSend: function (xhr) {
            
        },
        success: function (data, textStatus, jqXHR) {
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    });
    
    
};



$(document).on("keydown paste", "#search-tag-input", function (){
    
    
    
    var freg = $(this).val();
    var tags = [];
    $("#q-tag-list .li").each(function (){
        tags.push(Number($(this).attr("data-id-tag")));
    });
    
    if(tags.length > 6){
        alertBox.tipTop("لا يمكنك اضافة اكثر من 6 عناوين");
        return ;
    }
    
    Tag.search(freg , tags).done(function (data){
        
        if(isJson(data)){
            var jsonData = JSON.parse(data);
        }else{
            alert(data);
            return ;
        }
        
        var list = `<div class="result-wrapper">
                        <ul>`;
        
        for(var iii in jsonData){
            
            
            list += `<li data-tag-title="${jsonData[iii].title}" data-id-tag="${jsonData[iii].id_tag}" data-id-url="${jsonData[iii].id_url}">
                        <label class="tag">${jsonData[iii].title}</label>
                        (<span>${jsonData[iii].brief}</span>)
                    </li>`;
        }
        
        list += `   </ul>
                </div>`;
        
        if(jsonData.length < 1){
            list = "";
        }
        $("#tag-search-res").html(list);
        
        var width = $("#search-tag-input").width();
        var height = $("#tag-search-res").height();
        $("#tag-search-res").width(width);
        $("#tag-search-res").css({top: - height });
        
    });
    
});




$(document).on("click" , "#tag-search-res ul li", function (){
   
    var idTag    = $(this).attr("data-id-tag");
    var tagTitle = $(this).attr("data-tag-title");
    var idUrl    = $(this).attr("data-id-url");
    
    $("#tag-search-res .result-wrapper").fadeTo(200, 0, function (){
        $("#tag-search-res").empty();
    });
    
    var tag = ` <div class="li" data-tag-title="${tagTitle}" data-id-tag="${idTag}" data-id-url="${idUrl}">
                    <div>
                        <a class="easy-bg-color" href="${BASE_URL}/feed/${idUrl}" target="_blank">${tagTitle}</a>
                        <label class="remove-tag">&times;</label>
                    </div>
                </div>`;
    $("#q-tag-list").append(tag);
    $("#search-tag-input").val("");
    
});


$(document).on("click" , "#q-tag-list .li .remove-tag" , function (e){
    
    e.stopPropagation();
    $(this).parents("div").parents(".li").fadeTo(200 , 0, function (){
        $(this).animate({width: 0} , 1000, function (){
            $(this).remove();
        });
    });
    
});




$(document).on("click" ,  "#add-new-question" , function (){
    
    var qusetionContent = quill.getContents();
    var questionTitle   = $.trim($("#question-title").val());
    var QTitleWordCount = questionTitle.split(" ").length;
    $(this).attr("disabled", "disabled");
    var self = $(this);
    
    
    if(QTitleWordCount <= 2){
        alert("يجب ان يحتوى العنوان على اكثر من كلمتين");
        return ;
    }
    
    if(questionTitle.length < 8){
        
        alert("يجب ان يحتوى العنوان على اكثر من 8 حروف");
        return ;
        
    }
    var tags = [];
    $("#q-tag-list .li").each(function (){
        tags.push(Number($(this).attr("data-id-tag")));
    });
    
  
    
    $.ajax({
       
        url:BASE_URL+"/api/Question/add",
        data:{
            QueTitle  : questionTitle,
            QueTags   : JSON.stringify(tags),
            QueHtml   : clearBeforeSend(quill.root.innerHTML),
            QueDelta  : JSON.stringify(qusetionContent),
            QText     : quill.getText()
            
        },
        type: 'POST',
        beforeSend: function (xhr) {
            
        },
        success: function (data, textStatus, jqXHR) {
            self.removeAttr("disabled");
            if(isJson(data)){
                var jsonData = JSON.parse(data);
            }else{
                alert(data);
                return ;
            }
            
            if(jsonData.state === "ok"){
                redirectTO(jsonData.url);
            }else if(jsonData.state === "error_0"){
                alert("عليك تسجيل الدخول");
            }else if(jsonData.state === "error_1"){
                alert("هذا السؤال موجود بالفعل");
            }else if(jsonData.state === "error_5"){
                alert("عليك اضافة عنوان او اكثر للسؤال ");
            }else{
                alert(data);
            }
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus);
            self.removeAttr("disabled");
        }
        
    });
    
});