<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Laravel</title>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
        <link href="{{ URL::asset('css/app.css') }}" rel="stylesheet">
        <link href="{{ URL::asset('css/reset-min.css') }}" rel="stylesheet">
        <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/vue/2.2.1/vue.js"></script>
        <style>
            body {
                font-family: 'Nunito', sans-serif;
            }
        </style>
    </head>
    <script>

    const GlobalData = {
        CampName: "{{$Camp->camp_name}}",
        DateFrom: "{{$Camp->date_from}}",
        DateTo: "{{$Camp->date_to}}",
        total: {{$Camp -> budget_total}},
        dailyBudget: {{$Camp -> budget_daily}},
        ImageList: {!!json_encode($CampImages->toArray())!!}
    };
    </script>
    <body>
        <div id="app">
            @csrf
            <div class="row-input">
                <span class="lable">Name</span> 
                <input type="text" v-model="CampName" value="{{$Camp->camp_name}}" class="input" placeholder=""> 
                <button @click="editCampName({{$Camp->id_campaign}})">
                    <span v-if="isEditing" class="lds-dual-ring"></span>
                    <span v-else="isEditing">Edit</span>
                </button>
            </div>
            <div class="row-input">
                <span class="lable">Date From</span> 
                <input type="date" v-model="DateFrom" class="input" value="{{$Camp->date_from}}" placeholder=""> 
            </div>
            <div class="row-input">
                <span class="lable">Date To</span> 
                <input type="date" v-model="DateTo" value="{{$Camp->date_to}}" class="input" placeholder=""> 
            </div>
            <div class="row-input">
                <span class="lable">Total</span> 
                <input type="number" v-model="total" value="{{$Camp->budget_total}}" @keypress="OnlyNum($event)" class="input" placeholder="Total"> 
                <button @click="editTotal({{$Camp->id_campaign}})">
                    <span v-if="isEditing" class="lds-dual-ring"></span>
                    <span v-else="isEditing">Edit</span>
                </button>
            </div>
            <div class="row-input">
                <span class="lable">Daily budget</span>
                <input type="number" v-model="dailyBudget"  value="{{$Camp->budget_daily}}" @keypress="OnlyNum($event)" v-model="DailyBudget" class="input" placeholder="Daily Budget"> 
                <button @click="editDailyBudget({{$Camp->id_campaign}})">
                    <span v-if="isEditing" class="lds-dual-ring"></span>
                    <span v-else="isEditing">Edit</span>
                </button>
            </div>
            <div id="image-list-view">
                <ul>
                    <li v-for="(Image, index) in ImageList">
                        <img  v-if="Image.image_path" :src="`{{URL::asset('userImage')}}/` + Image.image_path" class="image-view-unit">
                        <div class="image-view-delete" @click="removeImage(Image.id_image)">
                            &times;
                        </div>
                    </li>
                </ul>
            </div>
            <div id="create-camp-wrapper">
                    
                <button class="btn" :disabled="isDeleting" @click="deleteCamp({{$Camp->id_campaign}})">
                    <span v-if="isDeleting" class="lds-dual-ring"></span>
                    <span v-else="isDeleting">Delete Camp</span>
                </button>
            </div>
        </div>
    </body>
    <script type="text/javascript" src="{{ URL::asset('js/show.js') }}"></script>
</html>
