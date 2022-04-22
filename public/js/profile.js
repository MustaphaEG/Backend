

$(document).on("click", "#edite-full-name" , function (e){
    e.stopPropagation();
    var oldName = $("#old-full-name").text();
    $("#old-full-name").html(`<input id="new-full-name-input" type="text" value="${$.trim(oldName)}"/>`);
    $(this).parent(".edit-btn").html(`<div id="save-new-full-name" class="save-btn">حفظ</div>`);
    
    $("#save-new-full-name").click(function (){
        $(this).html(`<img class="inf-loader" src="${BASE_URL+"/image/infLoader.svg"}"/>`);
        var newName = $("#new-full-name-input").val();
        $.ajax({
            url:BASE_URL+"/api/User/newName",
            type: 'POST',
            data:{
                newName: newName
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
                
                if(jsonData.state === "ok"){
                    $("#old-full-name").html(jsonData.user.full_name);
                    $('#edite-full-name-wr').replaceWith(`<label id="edite-full-name-wr" class="edit-btn">
                                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                                            <img id="edite-full-name" src="${BASE_URL}/image/icon/edit.svg"/>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                                        </label>`);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                
            }
        });
        
    });
    
    
});


var Profile = {};



Profile.topicUserFollow  = function (idUser){
    
    $.ajax({
        url: BASE_URL+"/api/Topic/userFollow",
        data:{
            alphaId: idUser
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
                                                <div>${jsonData[iii].follower}</div>
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

Profile.tagUserUse =  function (idUser){
    
    
    $.ajax({
        url: BASE_URL+"/api/Tag/userUse",
        data:{
            idUser: idUser
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
                                <label> ${jsonData[iii].used_num}</label>
                            </div>
                        </li>`;
            }
            
            $("#related-tags").html(`<ul class="flex"> ${list} </ul>`);
            
            
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    });
};





$(document).ready(function (){
    
    var page = $("#glo-container").attr("data-page");
    
    if(page === "profile"){
        
        var idUser = $("#glo-container").attr("data-id-user");
        Profile.tagUserUse(idUser);
        Profile.topicUserFollow(idUser);
        
    }
    
});