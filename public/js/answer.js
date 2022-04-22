

$(document).on("click","#add-que-ans", function (){
    
    
    var ansContent = quill.getContents();
    var idQue      = $(this).attr("data-id-que");
    $(this).attr("disabled" , "disabled");
    var self =  $(this);
    if(quill.getLength() < 30){
        
        alert("الاجابة صغيرة جدا");
        return ;
    }
    
    if(idQue.length < 1){
        alert("خطاء بالسؤال");
        return ;
    }
    
    $.ajax({
       
        url:BASE_URL+"/api/Answer/add",
        data:{
            AnsHtml   : clearBeforeSend(quill.root.innerHTML),
            AnsDelta  : JSON.stringify(ansContent),
            AnsText   : quill.getText(),
            QueId     : idQue
            
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
                Feed.Answer.refresh(jsonData.alphaId);
                quill.setContents([]);
                
            }else if(jsonData.state === "error_0"){
                alert("عليك تسجيل الدخول");
            }else if(jsonData.state === "error_1"){
                alert("هذا السؤال موجود بالفعل");
            }else{
                alert(data);
            }
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            self.removeAttr("disabled");
        }
        
    });
    
});


$(document).on("click" , ".ans-vote" , function (){
   
    var idAns = $(this).attr("data-id-ans");
    var vote  = $(this).attr("data-vote");
    
    $(".ans-vote").attr("disabled" , "disabled");
    $.ajax({
       
        url: BASE_URL+"/api/Answer/vote",
        data:{
            idAns : idAns,
            vote  : vote
        },
        type: 'POST',
        beforeSend: function (xhr) {
           
        },
        
        success: function (data, textStatus, jqXHR) {
            $(".ans-vote").removeAttr("disabled");
            Feed.Answer.refresh();
            
            $("#"+idAns+"-ans-up").removeClass("voted");
            $("#"+idAns+"-ans-down").removeClass("voted");
            
            if(isJson(data)){
                var jsonData = JSON.parse(data);
            }else{
                alert(data);
                return ;
            }
            
            if(jsonData.state === "ok"){
                if(jsonData.vote === "up"){
                    $("#"+idAns+"-ans-up").addClass("voted");
                }else if(jsonData.vote === "down"){
                    $("#"+idAns+"-ans-down").addClass("voted");
                }
                
                $("#"+idAns+"-ans-score").html(jsonData.ans.upvote - jsonData.ans.downvote);
            }else{
                alert(data);
            }
            
            
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
        
    });
    
});





$(document).on("click" , ".edit-ans", function (){
    
    var idAns = $(this).attr("data-id-ans");
    var ansContainer = idAns + "-ans";
    var idQue   = $("#glo-container").attr("data-idque");
    
    $("#" + ansContainer + " .ans-wrapper").html(`<div class="editor-wrapper"></div>`);
    $("#" + ansContainer + " .editor-wrapper").html($($.parseHTML(toolBarTem)[0]).attr("id", "ans-"+idAns+"-ans-TB"));
    $("#" + ansContainer + " .editor-wrapper").append(`<div id="ans-${(idAns+"-editor")}"></div>`);
    $("#" + ansContainer + " .editor-wrapper").append($($.parseHTML(DOWN_EDITOR)[0]).attr("id", "ans-"+idAns+"-ans-DE"));
    $("#" + ansContainer + " .editor-wrapper").animate({width:"100%"});
    $("#ans-" + idAns        + "-ans-DE .save-btn").html("حفظ التعديل");
    $("#ans-" + idAns        + "-ans-DE .save-btn").attr("data-id-ans", idAns);
    $("#ans-" + idAns        + "-ans-DE .save-btn").addClass("save-ans-edit");
    $("#ans-" + idAns        + "-ans-DE .save-btn").attr("id" , "ans-" +idAns + "-save-edit");
    
    
    
    new QEditor({
        editor    : "#ans-"+idAns+"-editor",
        downEditor: "#ans-"+idAns+"-ans-DE",
        counter   : "#ans-"+idAns+"-ans-DE" +" .counter",
        toolBar   : "#ans-"+idAns+"-ans-TB",
        editorId  : "ans-"+idAns+"-editor"
    });
    
    /* get editor content from DB*/
    $.ajax({
        url: BASE_URL+"/api/Answer/getEditorContent" ,
        data:{
            idAns: idAns
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
            
            var Ed = AllEditors.getEditor("ans-"+idAns+"-editor");
            if(!Ed){
                return ;
            }
            if(isJson(jsonData.Ans)){
                Ed.editor.editor.setContents(JSON.parse(jsonData.Ans));
            }
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    });
});


$(document).on("click" , ".delete-ans", function (){
    if(!window.confirm("سيتم حذف الاجابة")) {
        return ;
    }
    var idAns = $(this).attr("data-id-ans");
    var ansContainer = idAns + "-ans";
    var idQue   = $("#glo-container").attr("data-idque");
    
   
    
    /* get editor content from DB*/
    $.ajax({
        url: BASE_URL+"/api/Answer/delete" ,
        data:{
            idAns: idAns
        },
        type: 'POST',
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
            
            window.location.reload();
            
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        }
    });
});




$(document).on("click" , ".save-ans-edit", function (){
    
    var idAns = $(this).attr("data-id-ans");
    var Ed = AllEditors.getEditor("ans-"+idAns+"-editor");
    var ansContent = Ed.editor.editor.getContents();
    
    var htmlContent = clearBeforeSend(Ed.editor.editor.root.innerHTML);
    
    $.ajax({
        
        url: BASE_URL+"/api/Edit/ansContent",
        data:{
            idAns     : idAns,
            ansDelta  : JSON.stringify(ansContent),
            ansHtml   : htmlContent
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
                Feed.Answer.refresh();
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