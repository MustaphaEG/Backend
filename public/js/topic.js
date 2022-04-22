

var Topic = {};

Topic.follow = function (alphaId)
{
    return $.ajax({
        url:BASE_URL+"/api/Topic/follow",
        data:{
            alphaId:alphaId
        },
        type: 'POST',
        beforeSend: function (xhr) {
            
        },
        success: function (data, textStatus, jqXHR) {
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    });  
};

Topic.unfollow = function (alphaId)
{
    return $.ajax({
        url:BASE_URL+"/api/Topic/unfollow",
        data:{
            alphaId:alphaId
        },
        type: 'POST',
        beforeSend: function (xhr) {
            
        },
        success: function (data, textStatus, jqXHR) {
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    });  
};


$(document).on("click", ".topic-follow", function (){
    var alphaId = $(this).attr("data-id-topic");
    var self    = $(this);
    self.html(`<img src="${BASE_URL}/image/infLoader.svg"/>`);
    Topic.follow(alphaId).done(function (){
        self.removeClass("topic-follow");
        self.addClass("topic-unfollow");
        self.html(`<label>الغاء المتابعة</label><span></span>`);
    });
    
});

$(document).on("click", ".topic-unfollow", function (){
    var alphaId = $(this).attr("data-id-topic");
    var self    = $(this);
    self.html(`<img src="${BASE_URL}/image/infLoader.svg"/>`);
    
    
    Topic.follow(alphaId).done(function (){
        self.addClass("topic-follow");
        self.removeClass("topic-unfollow");
        self.html(`<label>متابعة</label><span></span>`);
    });
    
});



Topic.topTag = function (idTopic){
  
    $.ajax({
        url: BASE_URL+"/api/Topic/topTag",
        data:{
            alphaId: idTopic
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
            
            
            
            var list = "";
            
            for(var iii in jsonData){
                list += `
                        <li class="flex">
                            <a href="${BASE_URL+"/feed/"+jsonData[iii].id_url}" class="tag-txt">${jsonData[iii].title}</a>
                            <div class="score">
                                <label> ${jsonData[iii].used_num}</label>
                            </div>
                        </li>`;
            }
            if(USER_GROUP >= USER_GROUP_MODER){
                list += `
                        <li class="flex">
                            <button id="addTagByModer" class="tag-txt">+</button>
                        </li>`;
            }
            
            
            $("#related-tags").html(`<ul class="flex"> ${list} </ul>`);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    });
    
};



Topic.relatedTopics = function (idTopic){
    
    $.ajax({
        url: BASE_URL+"/api/Topic/related",
        data:{
            alphaId: idTopic
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
            
            
            
            var list = "";
            
            for(var iii in jsonData){
                list += `
                        <li class="flex easy-bg-color">
                            <a class="deco-non" href="${BASE_URL+"/topic/"+jsonData[iii].id_url}">
                                <div class="wrapper flex">
                                    <div class="right">
                                        <div class="image">
                                            <div class="bg" style="background-image: url('${BASE_URL+"/"+jsonData[iii].image}')"></div>
                                        </div>
                                    </div>
                                    <div class="left flex">
                                        <div>
                                            <div class="name">
                                                <h1>${jsonData[iii].title}</h1>
                                            </div>
                                            <div class="follower">
                                                <div>${numberToString(jsonData[iii].follower)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </li>`;
            }
            
            $("#similar-topics").html(`<ul class="flex"> ${list} </ul>`);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    });
    
};


$(document).ready(function (){
    
    var page      = $("#glo-container").attr("data-page");
    
    if(page === "topicDetail"){
        var idTopic = $("#glo-container").attr("data-id-topic");
        Topic.topTag(idTopic);
        Topic.relatedTopics(idTopic);
    }
    Feed.showMath();
    
});


$(document).on("click" , "#topic-follow-home.topic-home-unfollow" , function (){
    var idTopic = $("#glo-container").attr("data-id-topic");
     
    $(this).attr("disabled", "disabled");
    $(this).html(`<img src="${BASE_URL+"/"+"image/infLoader.svg"}"/>`);
    var self = $(this);
    Topic.unfollow(idTopic).done(function (data){
        
        self.removeAttr("disabled");
        self.removeClass("topic-home-unfollow");
        self.addClass("topic-home-follow");
        self.html(`<div class="icon"></div><div class="txt">متابعة</div>`);
    });
});

$(document).on("click" , "#topic-follow-home.topic-home-follow" , function (){
    var idTopic = $("#glo-container").attr("data-id-topic");
     
    $(this).attr("disabled", "disabled");
    $(this).html(`<img src="${BASE_URL+"/image/infLoader.svg"}"/>`);
    var self = $(this);
    Topic.follow(idTopic).done(function (data){
        
        self.removeAttr("disabled");
        self.removeClass("topic-home-follow");
        self.addClass("topic-home-unfollow");
       
        self.html(`<div class="icon"></div><div class="txt">الغاء المتابعة</div>`);
    });
});


Topic.allTags = function (page){
    return  $.ajax({
        
        url: BASE_URL+"/api/Topic/getTagsToAdd",
        
        data:{
            offset: (Math.max((page - 1) , 0)*75),
            alphaId: $("#glo-container").attr("data-id-topic")
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
                                <input class="replace-topic-tag" 
                                type="checkbox" ${jsonData.tagList[iii]._checked === "1" ? 'checked="checked"' : ""}
                                data-id-tag="${jsonData.tagList[iii].id_tag}" />
                            </div>
                        </li>`;
                
            }
            
            var pageCount = Math.ceil(jsonData.tagCount/75);
            var currentPage = (page);
            if(pageCount > 1){
                for (var jjj = 1; jjj <= pageCount ; jjj++){
                    pageList += `<li>
                                    <a data-page-index="${jjj}" class="${Number(currentPage) === jjj ? "selected" : ""} easy-bg-color Topic-AddTag-go-index">${jjj}</a>
                                </li>`;
                }
            }
            
            
            
            
            $("#list-to-add-tag-moder .tag-list-wrapper ul").html(list);
            $("#list-to-add-tag-moder .page-list ul").html(pageList);
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
};
$(document).on("click" , "#addTagByModer",function (){
    Topic.allTags(1);
    var overLay = ` <div id="over-layer-trans">
                        <div class="content-wrapper">
                            <div id="list-to-add-tag-moder">
                                <div class="content rtl">
                                    <div class="search-bar">
                                        <div class="wrapper">
                                            <div class="input">
                                                <input type="text" placeholder="بحث عن عنوان محدد"/>
                                            </div>
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


$(document).on("change" , ".replace-topic-tag" , function (){
    var idTag   =  $(this).attr("data-id-tag");
    var idTopic = $("#glo-container").attr("data-id-topic");
    $.ajax({
       
        url: BASE_URL+"/api/Tag/addToTopic",
        data:{
            idTag:  idTag,
            alphaId: idTopic
        },
        type: 'POST',
        beforeSend: function (xhr) {
            
        },
        success: function (data, textStatus, jqXHR) {
            Topic.topTag(idTopic);
            if(!isJson(data)){
                alert(data);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
        
        
    });
});



$(document).on("click" , "#save-added-and-close" , function (){
    $("#over-layer-wrapper").html("");
});

$(document).on("click" , ".Topic-AddTag-go-index" , function (){
   Topic.allTags(Number($(this).attr("data-page-index"))) ;
});