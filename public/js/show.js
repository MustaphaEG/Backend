/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */

var Application = {};
Application.Vue = new Vue({
    el: "#app",
    data: {
        CampName:    GlobalData.CampName,
        DateFrom:    GlobalData.DateFrom,
        DateTo:      GlobalData.DateTo,
        total:       GlobalData.total,
        dailyBudget: GlobalData.dailyBudget,
        ImageList:   GlobalData.ImageList,
        FileList:    [],
        isEditing:   false,
        isDeleting:  false
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
        editCampName: async function (idCamp) {
            let body = new FormData();
            /*  
             body.append("total", this.total);
             body.append("dailyBudget", this.dailyBudget);*/
            body.append("CampName", this.CampName);
            body.append("_token", document.getElementsByName("_token")[0].value);
            this.isEditing = true;
            let response = await fetch('/camp/editname/' + idCamp, {
                method: 'POST',
                body
            });
            this.isEditing = false;
            let Res = await response.json();
            if(Res.state == "ok")
                return location.reload(); 
            alert(JSON.stringify(Res));
        },
        editDateFrom: async  function (idCamp) {

        },
        editDateTo: async  function (idCamp) {

        },
        editTotal: async function (idCamp) {
            
            let body = new FormData();
            body.append("total", this.total);
            body.append("_token", document.getElementsByName("_token")[0].value);
            this.isEditing = true;
            let response = await fetch('/camp/edittotal/' + idCamp, {
                method: 'POST',
                body
            });
            this.isEditing = false;
             let Res = await response.json();
            if(Res.state == "ok")
                return location.reload(); 
            alert(JSON.stringify(Res));
            
            
        },
        editDailyBudget: async  function (idCamp) {
            /*  
             body.append("dailyBudget", this.dailyBudget);*/
            let body = new FormData();
            body.append("dailyBudget", this.dailyBudget);
            body.append("_token", document.getElementsByName("_token")[0].value);
            this.isEditing = true;
            let response = await fetch('/camp/editdaily/' + idCamp, {
                method: 'POST',
                body
            });
            this.isEditing = false;
            let Res = await response.json();
            if(Res.state == "ok")
                return location.reload(); 
            alert(JSON.stringify(Res));
        },
        removeImage: async  function (idImage) {
            
            this.isEditing = true;
            let body = new FormData();
            body.append("_token", document.getElementsByName("_token")[0].value);
            let response = await fetch('/camp/removeimage/' + idImage, {
                method: 'POST',
                body
            });
            this.isEditing = false;
            let Res = await response.json();
            if(Res.state == "ok")
                return location.reload(); 
            alert(JSON.stringify(Res));

        },
        deleteCamp: async  function (idCamp) {
            this.isEditing = true;
            let body = new FormData();
            body.append("_token", document.getElementsByName("_token")[0].value);
            let response = await fetch('/camp/deletecamp/' + idCamp, {
                method: 'POST',
                body
            });
            this.isEditing = false;
             let Res = await response.json();
            if(Res.state == "ok")
                return location.reload(); 
            alert(JSON.stringify(Res));

        }
    }
});

