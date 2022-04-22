
const VOTE_UP = 1;
const VOTE_DOWN = -1;

/*
 * 
 *  Feed Rate 
 * 
 */

$(document).on("click", ".vote-que" , function (){
   
    $(".vote-que").attr("disabled","disabled");
    var vote = $(this).attr("data-vote");
    var alphaId = $(this).attr("data-id-feed");
    
    $.ajax({
       
        url:BASE_URL+"/api/Feed/vote",
        data:{
            vote: vote,
            alphaID: alphaId
        },
        type: 'POST',
        beforeSend: function (xhr) {
            
        },
        success: function (data, textStatus, jqXHR) {
            
            $(".vote-que").removeAttr("disabled");
            if(isJson(data)){
                var jsonData = JSON.parse(data);
            }else{
                alert(data);
                return ;
            }
            
           
            
            if(jsonData.state === "ok"){
                
                $("#"+alphaId+"-down").removeClass("voted");
                $("#"+alphaId+"-up").removeClass("voted");
                
                
                if(Number(jsonData.vote) === VOTE_UP){
                    $("#"+alphaId+"-up").addClass("voted");
                }else if(Number(jsonData.vote) === VOTE_DOWN){
                    $("#"+alphaId+"-down").addClass("voted"); 
                }
                
                
                $("#"+alphaId+"-vote-num").html(jsonData.que.upvote - jsonData.que.downvote); 
                
                
            }else{
                alert(data);
            }
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
        
    });
    
});


var Feed = {};


Feed.remainAnswers = function (idQue, ord, offset){
  
    return $.ajax({
        url:BASE_URL+"/api/Answer/getForQue",
        data:{
            idQue: idQue,
            ord: ord,
            offset: offset
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

Feed.Answer = {};
Feed.Answer.refresh =  function (idAnswer){
    var idQue     = $("#glo-container").attr("data-idQue");
    var ansOffset = $("#glo-container").attr("data-ans-offset");
    var ansOrder  = $("#glo-container").attr("data-ans-ord");
    Feed.remainAnswers(idQue, ansOrder, ansOffset).done(function (data){
        
        if(!isJson(data)){
            alert(data);
            return ;
        }
        
        var jsonData = JSON.parse(data);
        $("#Que-Ans-Wrapper").empty();
        
        for(var iii in jsonData){
           $("#Que-Ans-Wrapper").append($.parseHTML(jsonData[iii])) 
        }
        
        if(idAnswer && $("#"+idAnswer+"-ans").length > 0){
            $('html, body').animate({
                scrollTop: $("#"+idAnswer+"-ans").offset().top - 180
            }, 800);
        }
        
        Feed.showMath();
    });
};

Feed.showMath = function (){
    $(".rich-text .formula-rander").each(function (){
        $(this).html(katex.renderToString($(this).attr("data-value"), {
        throwOnError: false
        }));
    });
};

Feed.unitRecommend = function (unit){
    
    return `<li class="li">
                <div class="data">
                    <div class="rate">${unit.vote}</div>
                </div>
                <div class="q-title">
                    <a href="${BASE_URL+"/"+unit.id_url}">${unit.title}</a>
                </div>
            </li>`;
    
}
Feed.related = function (list){
    var ul = "";
    for(var iii in list){
        ul += Feed.unitRecommend(list[iii]);
    }
    
    $("#similar-feeds").html(ul);
};

Feed.similar = function (list){
    var ul = "";
    for(var iii in list){
        ul += Feed.unitRecommend(list[iii]);
    }
    
    $("#related-feeds").html(ul);
}; 


Feed.getRecommend = function (){
    
    var idQue = $("#glo-container").attr("data-idque");
    
    $.ajax({
        url:BASE_URL+"/api/Feed/recommend",
        data:{
            alphaID:idQue
        },
        type: 'GET',
        beforeSend: function (xhr) {
            
        },
        success: function (data, textStatus, jqXHR) {
            if(isJson(data)){
                var jsonData = JSON.parse(data);
            }else{
                alert(data);
                return ;
            }
            
            if(jsonData.state === "ok"){
                
                Feed.related(jsonData.related);
                Feed.similar(jsonData.similar);
                
                
            }else{
                alert(data);
            }
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    });
    
};


Feed.topicList = function (){
    var idQue = $("#glo-container").attr("data-idque");
    
    return $.ajax({
        url:BASE_URL+"/api/Feed/topicList",
        data:{
            alphaID:idQue
        },
        type: 'GET',
        beforeSend: function (xhr) {
            
        },
        success: function (data, textStatus, jqXHR) {
            if(isJson(data)){
                var jsonData = JSON.parse(data);
            }else{
                alert(data);
                return ;
            }
            
            var list = '';
            
            for (var iii  in jsonData){
                list += `<li>
                            <a class="link" href="${BASE_URL+"/topic/"+jsonData[iii].id_url}">
                                <div class="icon-wrapper">
                                    <div class="icon" style="background-image: url('${BASE_URL+"/"+jsonData[iii].image}');"></div>
                                </div>
                                <div class="label dotted">${jsonData[iii].title}</div>
                            </a>
                        </li>`;
                
            }
            
            $("#topic-list").html(list);
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    });
};

Feed.Taged = {};
Feed.Taged.related = function (){
    
    var idTag = $("#glo-container").attr("data-id-tag");
    
    $.ajax({
        url: BASE_URL+"/api/Tag/related",
        data:{
            idTag: idTag
        },
        beforeSend: function (xhr) {
            
        },
        success: function (data, textStatus, jqXHR) {
            
            if(isJson(data)){
                var jsonData = JSON.parse(data);
            }else{
                alert(data);
                return ;
            }
            
            var list = "";
            
            for(var iii in jsonData){
                list += `
                        <li class="flex">
                            <a href="${BASE_URL+"/feed/"+jsonData[iii].id_url}" class="tag-txt">${jsonData[iii].title}</a>
                            <div class="score">
                                <label> ${numberToString(jsonData[iii].used_num)}</label>
                            </div>
                        </li>`;
            }
            
            $("#related-tags").html(`<ul class="flex"> ${list} <ul/>`);
            
            
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    });
};

Feed.Taged.similar = function (){
    var idTag = $("#glo-container").attr("data-id-tag");
    
    $.ajax({
        url: BASE_URL+"/api/Tag/similar",
        data:{
            idTag: idTag
        },
        beforeSend: function (xhr) {
            
        },
        success: function (data, textStatus, jqXHR) {
            
            if(isJson(data)){
                var jsonData = JSON.parse(data);
            }else{
                alert(data);
                return ;
            }
            
            
            
            var list = "";
            
            for(var iii in jsonData){
                list += `
                        <li class="flex">
                            <a href="${BASE_URL+"/feed/"+jsonData[iii].id_url}" class="tag-txt">${jsonData[iii].title}</a>
                            <div class="score">
                                <label> ${numberToString(jsonData[iii].used_num)}</label>
                            </div>
                        </li>`;
            }
            
            $("#similar-tags").html(`<ul class="flex"> ${list} <ul/>`);
            
            
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
};


Feed.Taged.topicList = function (){
  
    var idTag = $("#glo-container").attr("data-id-tag");
    
    $.ajax({
        url: BASE_URL+"/api/Tag/topic",
        data:{
            idTag: idTag
        },
        beforeSend: function (xhr) {
            
        },
        success: function (data, textStatus, jqXHR) {
            
            if(isJson(data)){
                var jsonData = JSON.parse(data);
            }else{
                alert(data);
                return ;
            }
            
            console.log(jsonData);
            
            var list = "";
            
            for(var iii in jsonData){
                list += `
                        <li>
                            <a class="link" href="${BASE_URL+"/topic/"+jsonData[iii].id_url}">
                                <div class="icon-wrapper">
                                    <div class="icon" style="background-image: url('${BASE_URL+"/"+jsonData[iii].image}');"></div>
                                </div>
                                <div class="label dotted">${jsonData[iii].title}</div>
                            </a>
                        </li>`;
            }
            $("#topic-list").html(list);
            
            
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
    
};

$(document).ready(function (){
    
    var page      = $("#glo-container").attr("data-page");
    
    if(page === "showQ"){
        
        Feed.Answer.refresh();
        Feed.getRecommend();
        Feed.topicList();
        
    }else if(page === "feed"){
        
        Feed.Taged.related();
        Feed.Taged.similar();
        Feed.Taged.topicList();
        
    }
    Feed.showMath();
    
});

Feed.allTags = function (pageIndex){
    
    $.ajax({
        url: BASE_URL + "/api/Feed/getTagsToAdd",
        data:{
            offset: (Math.max(pageIndex -1) * 75),
            idQue: $("#glo-container").attr("data-idque")
        },
        type: 'GET',
        beforeSend: function (xhr) {
            
        },
        success: function (data, textStatus, jqXHR) {
            if(isJson(data)){
                var jsonData = JSON.parse(data);
            }else{
                alert(data);
                console.log(data)
            }
            
            var list = ``;
            var pageList = ``;
            
            for(var iii in jsonData.tagList){
                
                list += `<li class="flex">
                            <div class="wrapper">
                                <a href="${BASE_URL+"/feed/"+(jsonData.tagList[iii].id_url)}" class="deco-non" target="_blank">${jsonData.tagList[iii].title}</a>
                            </div>
                            <div class="check-box">
                                <input class="replace-feed-tag" 
                                type="checkbox" ${jsonData.tagList[iii]._checked === "1" ? 'checked="checked"' : ""}
                                data-id-tag="${jsonData.tagList[iii].id_tag}" />
                            </div>
                        </li>`;
                
            }
            
            var pageCount = Math.ceil(jsonData.tagCount/75);
            var currentPage = (pageIndex);
            if(pageCount > 1){
                for (var jjj = 1; jjj <= pageCount ; jjj++){
                    pageList += `<li>
                                    <a data-page-index="${jjj}" class="${Number(currentPage) === jjj ? "selected" : ""} easy-bg-color index-feed-tag-list tAddTag-go-index">${jjj}</a>
                                </li>`;
                }
            }
            
            var queTagList = "";
            for(var iii  in jsonData.queTags){
                queTagList += ` <li>
                                    <button class="tag-txt">
                                        <div class="flex">
                                            <a href="${BASE_URL+"/feed/"+jsonData.queTags[iii].id_url}" target="_blank" class="deco-non">${jsonData.queTags[iii].title}</a>
                                            <div class="close-btn remove-tag-feed" data-id-tag="${jsonData.queTags[iii].id_tag}"></div>
                                        </div>
                                    </button>
                                </li>`;
            }
            
            
            
            
            $("#list-to-add-tag-moder .tag-list-wrapper ul").html(list);
            $("#list-to-add-tag-moder .page-list ul").html(pageList);
            $("#feed-tag-list-wrapper").html(`<ul class="flex">${queTagList}</ul>`);
            $("#list-to-add-tag-moder").attr("data-index-page" , pageIndex);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    });
};



$(document).on("click" , "#update-que-tag" , function (){
    Feed.allTags(1);
    var overLay = ` <div id="over-layer-trans">
                        <div class="content-wrapper">
                            <div id="list-to-add-tag-moder" data-index-page="1">
                                <div class="content rtl">
                                    <div class="search-bar">
                                        <div class="wrapper">
                                            <div class="input">
                                                <input type="text" placeholder="بحث عن عنوان محدد"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="feed-tag-list">
                                        <div id="feed-tag-list-wrapper">
                                            <ul>
                                                <button class="tag-txt">javascript</button>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="page-list">
                                        <div class="list-wrapper">
                                            <ul class="flex"></ul>
                                        </div>                                            
                                    </div>
                                    <div class="tag-list-wrapper">
                                        <ul class="flex tag-list">
                                        </ul>
                                    </div>
                                    <div class="save flex">
                                        <div>
                                            <button id="save-added-and-close" class="save-btn">حفظ</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
    
    $("#over-layer-wrapper").html(overLay);
});


$(document).on("click" , ".tAddTag-go-index" , function (){
   Feed.allTags(Number($(this).attr("data-page-index"))) ;
});

Feed.updateTag = function (idTag){
   
    var idQue   = $("#glo-container").attr("data-idque");
    $.ajax({
       
        url: BASE_URL+"/api/Edit/feedTag",
        data:{
            idTag:  idTag,
            idQue: idQue
        },
        type: 'POST',
        beforeSend: function (xhr) {
            
        },
        success: function (data, textStatus, jqXHR) {
            
            if(!isJson(data)){
                alert(data);
            }
            Feed.allTags($("#list-to-add-tag-moder").attr("data-index-page"));
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
        
        
    });
};

$(document).on("change" , ".replace-feed-tag" , function (){
    var idTag   =  $(this).attr("data-id-tag");
    Feed.updateTag(idTag);
});

$(document).on("click" , ".remove-tag-feed" , function (){
    var idTag   =  $(this).attr("data-id-tag");
    Feed.updateTag(idTag);
});

$(document).on("click" , "#save-added-and-close" , function (){
    $("#over-layer-wrapper").html("");
});



$(document).on("click" , "#edite-que-title .edit-btn" , function (){
    var titleOld = $.trim($("#q-show-title .q-title").text());
    $("#q-show-title .q-title").replaceWith(`<div><input type="text" value="${titleOld}"/></div>`);
    $("#q-show-title input").animate({width: "350px"} , 750);
    $("#q-show-title input").focus();
    
    $(this).replaceWith(`<button class="save-btn">حفظ</button>`);
    
});


$(document).on("click" , "#edite-que-title .edit-btn" , function (){
    var titleOld = $.trim($("#q-show-title .q-title").text());
    $("#q-show-title .q-title").replaceWith(`<div><input type="text" value="${titleOld}"/></div>`);
    $("#q-show-title input").animate({width: "350px"} , 750);
    $("#q-show-title input").focus();
    
    $(this).replaceWith(`<button class="save-btn">حفظ</button>`);
    
});

$(document).on("click" , "#edite-que-title .save-btn" , function (){
    var newTitle = $("#q-show-title input").val();
    var idQue   = $("#glo-container").attr("data-idque");
    $.ajax({
        url: BASE_URL+"/api/Edit/queTitle",
        type: 'POST',
        data:{
            idQue : idQue,
            newTitle : newTitle
        },
        beforeSend: function (xhr) {
            
        },
        success: function (data, textStatus, jqXHR) {
            if(isJson(data)){
                var jsonData = JSON.parse(data);
            }else{
                alert(data);
                return ;
            }
            redirectTO(BASE_URL + "/" +jsonData.idUrl)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    });
});


$(document).on("click", "#update-que-content" , function (){
    
    $("#QueSummary").html(`<div class="editor-wrapper"></div>`);
    $("#QueSummary .editor-wrapper").html($($.parseHTML(toolBarTem)[0]).attr("id", "editorQueSummryTB"));
    $("#QueSummary .editor-wrapper").append(`<div id="editorQueSummry"></div>`);
    $("#QueSummary .editor-wrapper").append($($.parseHTML(DOWN_EDITOR)[0]).attr("id", "downEditorQueSummry"));
    $("#QueSummary .editor-wrapper").animate({width:"100%"});
    $("#downEditorQueSummry .save-btn").html("حفظ التعديل");
    $("#downEditorQueSummry .save-btn").attr("id" , "QueSummrySaveEdit");
    var idQue   = $("#glo-container").attr("data-idque");
    
    new QEditor({
        editor: "#editorQueSummry",
        downEditor: "#downEditorQueSummry",
        counter: "#downEditorQueSummry .counter",
        toolBar :"#editorQueSummryTB",
        editorId: "editorQueSummry"
    });
    /* get editor content from DB*/
    $.ajax({
        url: BASE_URL+"/api/Question/getEditorContent" ,
        data:{
            idQue: idQue
        },
        type: 'GET',
        beforeSend: function (xhr) {
            
        },
        success: function (data, textStatus, jqXHR) {
            if(isJson(data)){
                var jsonData =  JSON.parse(data);
            }else{
                alert(data);
                return ;
            }
            
            if(jsonData.state !== "ok"){
                
                alert(data);
                return ;
            }
            
            
            var Ed = AllEditors.getEditor("editorQueSummry");
            if(!Ed){
                return ;
            }
            if(isJson(jsonData.Que)){
                Ed.editor.editor.setContents(JSON.parse(jsonData.Que));
            }
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    });
    
    
});



$(document).on("click" , "#QueSummrySaveEdit" , function (){
    
    var Ed = AllEditors.getEditor("editorQueSummry");
    var idQue   = $("#glo-container").attr("data-idque");
    if(!Ed){
        return ;
    }
    
    var qusetionContent = Ed.editor.editor.getContents();
    $.ajax({
       
        url:BASE_URL+"/api/Edit/summryQue",
        data:{
            QueHtml   : clearBeforeSend(Ed.editor.editor.root.innerHTML),
            QueDelta  : JSON.stringify(qusetionContent),
            idQue     : idQue
            
        },
        type: 'POST',
        beforeSend: function (xhr) {
            
        },
        success: function (data, textStatus, jqXHR) {
            
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
        }
        
    });
    
});


$(document).on("click", "#delete-que", function (){
    
   if(!window.confirm("سيتم حذف السؤال")) {
        return ;
   }
   
   var idQue   = $("#glo-container").attr("data-idque");
   
   return $.ajax({
        url:BASE_URL+"/api/Question/delete",
        data:{
            idQue: idQue
        },
        type: 'POST',
        beforeSend: function (xhr) {
            
        },
        success: function (data, textStatus, jqXHR) {
            alert("تم حذف السؤال بنجاح");
            redirectTO(BASE_URL);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    });
    
});