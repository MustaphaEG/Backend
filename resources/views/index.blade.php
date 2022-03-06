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
            @foreach ($Camps as $OneCamp)
            <p><a href="/camp/{{$OneCamp->id_campiagn}}">{{$OneCamp->camp_name}}</a></p>
            @endforeach
        </div>
    </body>
    <script type="text/javascript" src="{{ URL::asset('js/home.js') }}"></script>
</html>
