/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */

var Application = {};
Application.Vue = new Vue({
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

