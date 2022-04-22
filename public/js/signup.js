

const SignupForm = new Vue({
    el: "#app",
    data: {
        CampName: "",
        DateFrom: "0-0-0",
        DateTo: "0-0-0",
        total: 0,
        dailyBudget: 0,
        FileList: [],
        isCreatingCamp: false
    },
    methods: {
        OnlyNum: function (evt) {
            evt = evt || window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            } else {
                return true;
            }
        },

        addFile: function () {

        },
        handelFileUpload: function () {

            let FileInput = document.getElementById("input-camp-image");
            if (!FileInput)
                return;
            for (let File of FileInput.files) {
                this.FileList.push({
                    Url: URL.createObjectURL(File),
                    File
                });
            }
        },
        removeFileFromView: function (fileIndex) {
            this.FileList.splice(fileIndex, 1);
        },

        createCamp: async function () {
            
            
            this.isCreatingCamp = true;

            let body = new FormData();

            for (let fileIndex in this.FileList) {
                body.append(`file[${fileIndex}]`, this.FileList[fileIndex].File);
            }
            
            body.append("_token", document.getElementsByName("_token")[0].value);
            body.append("CampName", this.CampName);
            body.append("DateFrom", this.DateFrom);
            body.append("DateTo", this.DateTo);
            body.append("total", this.total);
            body.append("dailyBudget", this.dailyBudget);
            
            let response = await fetch('/camp/create', {
                method: 'POST',
                body: body
            });
            this.isCreatingCamp = false;
            let Res = await response.json();
            
            if(Res.state == "ok")
                window.location.replace(Res.RedirectTo);
            else 
                alert(JSON.stringify(Res));

        }

    }
});



$(document).ready(function (){
    
    /*validate max length*/
    $(document).on("input keydown keyup mousedown mouseup select contextmenu drop", "#form-container .input", function (){
    
    
        var val = this.value;
        var maxLength = $(this).attr("data-max-length");
        

        if (val.length <= maxLength) {

            this.oldValue = this.value;
            this.oldSelectionStart = this.selectionStart;
            this.oldSelectionEnd = this.selectionEnd;

        }else if (this.hasOwnProperty("oldValue")) {

            this.value = this.oldValue;
            this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);

        }
        
        $(this).next(".max-num").children("label").html($(this).val().length);
    
    });


    /*validate Email*/
    $(document).on("input keydown keyup mousedown mouseup select contextmenu drop", "#user-email", function (){
    
    
        var val = this.value;
        

        if (validateEmail(val)) {

            this.oldValue = this.value;
            this.oldSelectionStart = this.selectionStart;
            this.oldSelectionEnd = this.selectionEnd;

        }else if (this.hasOwnProperty("oldValue")) {

            this.value = this.oldValue;
            this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);

        }
        
        $(this).next(".max-num").children("label").html($(this).val().length);
    
    });




    

    $("#form-container .input").each(function (){
        $(this).next(".max-num").children("label").html($(this).val().length);
    });
    
    
    
    /*sign up new account*/
    $(document).on("click" , "#sign-up-btn" , function (){
        
        var userName        = $("#user-name").val();
        var userPass        = $("#user-password").val();
        var userMail        = $("#user-email").val();
        var userPassConfirm = $("#password-confirm").val();
        
        $(this).attr("disabled","disabled");
        
        if(userName.length < 3){
            
            alertBox.tipTop("لا يمكن ان يكون اسم المستخدم اقل من 3 حروف");
            
        } else if(userName.length > MAX.USER_NAME_LENGTH){
            
            alertBox.tipTop(`لا يمكن ان يكون اسم المستخدم اكثر من ${MAX.USER_NAME_LENGTH} حروف`);
            
        } else if(userPass.length < 5){
            alertBox.tipTop("لا يمكن ان تكون  كلمة المرور اقل من 5 حروف");
            
        } else if(userPass.length > MAX.USER_PASS_LENGTH){
            
            alertBox.tipTop(`لا يمكن ان تكون  كلمة المرور اكثر من ${MAX.USER_PASS_LENGTH} حروف`);
            
        } else if(userMail.length < 3){
            
            alertBox.tipTop("لا يمكن ان يكون  البريد الالكترونى اقل من 3 حروف");
            
        } else if(userMail.length > MAX.USER_EMAIL_LENGTH){
            
            alertBox.tipTop(`لا يمكن ان يكون  البرد الالكترونى اكثر من ${MAX.USER_EMAIL_LENGTH} حروف`);
            
        } else if(userPassConfirm !== userPass){
            
            alertBox.tipTop("كلمتى المرور غير متطابقتين");
            
        }else{
            
            $.ajax({
               
                url:BASE_URL+"/api/User/add",
                type: 'POST',
                data:{
                    
                    userName:userName,
                    userpass:userPass,
                    userMail:userMail
                    
                },
                beforeSend: function (xhr) {
                    
                },
                success: function (data, textStatus, jqXHR) {
                    $(this).removeAttr("disabled");
                    if(isJson(data)){
                        var jsonData = JSON.parse(data);
                    }else{
                        alert(data);
                    }
                   
                    if(jsonData.state === "error_1"){
                        
                        alertBox.tipTop("خطاء اسم المستخدم");
                        
                    }else if(jsonData.state === "error_2"){
                        
                        alertBox.tipTop("خطاء كلمة المرور");
                        
                    }else if(jsonData.state === "error_3"){
                        
                        alertBox.tipTop("خطاء البريد الاكترونى");
                        
                    }else if(jsonData.state === "error_4"){
                        
                        alertBox.tipTop("البريد الالكترونى موجود بالفعل");
                        
                    }else if(jsonData.state === "error_5"){
                        
                        alertBox.tipTop("خطاء غير معروف حاول مرة اخرى");
                        
                    }
                    
                    
                    if(jsonData.url){
                        
                        window.location.href = BASE_URL+`/@${jsonData.url}`;
                        window.location.replace(BASE_URL + `/@${jsonData.url}`);
                        
                    }
                    
                    
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                }
                
                
            });
            
        }
        
        
    });
    
    
    
    $(document).on("click" , "#log-in-btn", function (){
       
        var userMail        = $("#user-mail").val();
        var userPass        = $("#user-password").val();
        $(this).attr("disabled" , "disabled");
        
        $.ajax({
               
                url:BASE_URL+"/api/User/login",
                type: 'POST',
                data:{
                    
                    userMail:userMail,
                    userPass:userPass
                    
                },
                beforeSend: function (xhr) {
                    
                },
                success: function (data, textStatus, jqXHR) {
                    $("#log-in-btn").removeAttr("disabled");
                    if(isJson(data)){
                        var jsonData = JSON.parse(data);
                    }else{
                        alert(data);
                    }
                   
                    if(jsonData.state === "error_email"){
                        
                        alertBox.tipTop("خطاء فى البريد الالكترونى");
                        
                    }else if(jsonData.state === "error_pass"){
                        
                        alertBox.tipTop("خطاء كلمة المرور");
                        
                    }
                    if(jsonData.state === "ok"){
                        
                        window.location.href   = BASE_URL;
                        window.location.replace(BASE_URL);
                        
                    }
                    
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    $("#log-in-btn").removeAttr("disabled");
                }
                
                
            });
        
    });
});

