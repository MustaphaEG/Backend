
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


const MAX = {
    USER_NAME_LENGTH:36,
    USER_EMAIL_LENGTH:64,
    USER_PASS_LENGTH:50
};


function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}



var ArabicNumber =
        {
     "0" :"&\#1632;",
     "1" :"&\#1633;",
     "2" :"&\#1634;",
     "3" :"&\#1635;",
     "4" :"&\#1636;",
     "5" :"&\#1637;",
     "6" :"&\#1638;",
     "7" :"&\#1639;",
     "8" :"&\#1640;",
     "9" :"&\#1641;"
        };
function getArabicNumbers(str)
{
    var newStr = "";

    str = String(str);

    for(var i=0; i<str.length; i++)
    {
        newStr += ArabicNumber[(str.charAt(i))];
    }

    return newStr;
}




var alertBox = {};


alertBox.tipTop = function (msg){
    
    
    var box = `<div id="alert-top-tip" class="hidden">
                    <div class="box">
                        <div class="content normal">
                           ${msg}
                        </div>
                    </div>
                </div>`;
    
    $("#alert-top-tip-wrapper").html(box);
    $("#alert-top-tip").css("top", "+=120px");
    
    setTimeout(function (){
        $("#alert-top-tip").fadeOut(function (){
            $("#alert-top-tip").remove();
        });
    }, 3500);
    
    
};


var redirectTO = function (url){
    window.location.href = url;
    window.location.replace(url);
};




function clearBeforeSend(html){
    
    var dom = $(html);
    dom.find('p').filter(function() {
        return !$.trim(this.innerHTML);
    }).remove();
    dom.find(".ql-formula").addClass("formula-rander").html(dom.find(".ql-formula").attr("data-value"));
    return $.trim($("<div>").append(dom).html());
}



$(document).on("keyup paste", "#glo-search", function (){
    
    var words = $(this).val();
    
    var loading = ` 
                    <div class="res-wrapper rtl">
                        <div class="arrow"></div>
                        <div class="ol">
                            <div class="li loading easy-bg-color">
                                <img src="${BASE_URL}/image/infLoader.svg"/>
                            </div>
                        </div>
                    </div>`;
    $.ajax({
        url: BASE_URL+"/api/Search/find",
        type: 'GET',
        data:{
            words:words
        },
        beforeSend: function (xhr) {
            $("#search-result").html(loading);
        },
        success: function (data, textStatus, jqXHR) {
            
            if(isJson(data)){
                var jsonData = JSON.parse(data);
            }else{
                alert(data);
                return ;
            }
            var list = ``;
            
            for(var iii in jsonData){
                list += `   
                            <div class="li easy-bg-color">
                                <a href="${BASE_URL+"/"+jsonData[iii].id_url}" class="flex">
                                    <div class="icon"><img src="image/icon/ask.svg"></div>
                                    <div class="title">${jsonData[iii].title}</div>
                                </a>
                            </div>`;
                
            }
            
            var res = ` <div class="res-wrapper rtl">
                            <div class="arrow"></div>
                            <div class="ol">
                                ${list}
                            </div>
                        </div>`;
            $("#search-result").html(res);
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    });
});


function numberToString(num){
    return num;
}


const toolBarTem = `<div class="ql-toolbar ql-snow edit-TB">
                        <span class="ql-formats">
                            <button class="ql-bold" type="button"></button>
                            <button class="ql-italic" type="button"></button>
                            <button class="ql-underline" type="button"></button>
                            <button class="ql-strike" type="button"></button>
                        </span>
                        <span class="ql-formats">
                            <button class="ql-header" value="1" type="button"></button>
                            <button class="ql-blockquote" type="button"></button>
                            <button class="ql-code-block" type="button"></button>
                        </span>
                        <span class="ql-formats">
                            <button class="ql-list" value="ordered" type="button"></button>
                            <button class="ql-list" value="bullet" type="button"></button>
                        </span>
                        <span class="ql-formats">
                            <select class="ql-align">
                                <option selected="" value="right"></option>
                                <option value="left"></option>
                                <option value="center"></option>
                            </select>
                        </span>
                        <span class="ql-formats">
                            <button class="ql-link" type="button"></button>
                            <button class="ql-image" type="button"></button>
                            <button class="ql-formula" type="button"></button>
                        </span>
                        <span id="quran-container" class="ql-formats" >
                            <button class="ql-quran" id="insert-aya" type="button">
                                <img src="${BASE_URL}/image/icon/editor/mos7af.svg"/>
                            </button>
                        </span>
                    </div>`;

const  DOWN_EDITOR = `<div class="flex down-edit-editor">
                            <div class="counter"> 0 كلمة &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    0 حرف </div>
                            <div class="save-draft flex">
                                <div class="draft-state"></div>
                                <div>
                                    <div class="save-btn">حفظ فى مسودة</div>
                                </div>
                            </div>
                        </div>`;