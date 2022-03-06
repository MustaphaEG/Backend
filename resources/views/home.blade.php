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
    <body>
        <div id="app">
           @csrf
            <div class="row-input">
                <span class="lable">Name</span> <input type="text" v-model="CampName" class="input" placeholder=""> 
            </div>
            <div class="row-input">
                <span class="lable">Date From</span> <input type="date" v-model="DateFrom" class="input" placeholder=""> 
            </div>
            <div class="row-input">
                <span class="lable">Date To</span> <input type="date" v-model="DateTo" class="input" placeholder=""> 
            </div>
            <div class="row-input">
                <span class="lable">Total</span> <input type="number" v-model="total" @keypress="OnlyNum($event)" class="input" placeholder="Total"> 
            </div>
            <div class="row-input">
                <span class="lable">Daily budget</span> <input type="number" v-model="dailyBudget"  @keypress="OnlyNum($event)" v-model="DailyBudget" class="input" placeholder="Daily Budget"> 
            </div>
            <div class="row-input">
                <span class="lable">Images</span> <input type="file" id="input-camp-image" accept="image/*" @change="handelFileUpload" multiple  class="input" placeholder=""> 
            </div>
            <div id="image-list-view">
                <ul>
                    <li v-for="(File, index) in FileList">
                        <img  v-if="File.Url" :src="File.Url" class="image-view-unit">
                        <div class="image-view-delete" :data-image-index="index" @click="removeFileFromView(index)">
                            &times;
                        </div>
                    </li>
                </ul>
            </div>
            <div id="create-camp-wrapper">
                <button class="btn" :disabled="isCreatingCamp" @click="createCamp">
                    <span v-if="isCreatingCamp" class="lds-dual-ring"></span>
                    <span v-else="isCreatingCamp">Create Camp</span>
                </button>
            </div>
        </div>
    </body>
    <script type="text/javascript" src="{{ URL::asset('js/home.js') }}"></script>
</html>
