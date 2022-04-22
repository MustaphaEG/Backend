var User = {};

User.getFeed = function (offset)
{
    return $.ajax({
        url: BASE_URL+"/api/Feed/getUserHomeFeeds" ,
        data:{
            offset:offset
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


User.Topics = function (){
  
    return $.ajax({
        url: BASE_URL+"/api/Topic/userHomeFollow" ,
        data:{},
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

User.newTagFeed = function (){
    return $.ajax({
        url: BASE_URL+"/api/Tag/withNewFeed" ,
        data:{},
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
                                <label>${numberToString(jsonData[iii].num)} سؤال</label>
                            </div>
                        </li>`;
            }
            
            $("#recent-tag-feeds").html(list);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    });
};


User.newTopicFeed = function (){
    return $.ajax({
        url: BASE_URL+"/api/Topic/withRecentFeed" ,
        data:{},
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
                                                <div>${numberToString(jsonData[iii].num)} سؤال</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </li>`;
            }
            
            $("#recent-topic-feeds").html(list);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    });
};


User.logOut  = function (){
    return $.ajax({
        url: BASE_URL+"/api/User/logout",
        data:{
            logout: true
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

$(document).ready(function (){
    
    var page      = $("#glo-container").attr("data-page");
    
    if(page === "userHome"){
        
        User.Topics();
        User.newTopicFeed();
        User.newTagFeed();
    }
    Feed.showMath();
    
});

$(document).on("click", "#logoutFromAccount", function (){
   
    User.logOut().done(function (data){
        redirectTO(BASE_URL);
    });
    
});





$(document).on("click" , "#glo-header .profile .user-image", function (e){
    
    e.preventDefault();
    e.stopPropagation();
    
    $("#glo-header .profile-pop-up").fadeToggle();
    
});