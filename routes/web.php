<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdCampigain;
use \Illuminate\Support\Facades\Redis;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/home', function () {
    
    //$redis = app()->make("redis");
    //print_r($redis->set());
    //$redis->set("Key", "Test");
   
    return view('home');
});



Route::post("/camp/editname/{id}",    [AdCampigain::class, 'editname']);
Route::post("/camp/edittotal/{id}",   [AdCampigain::class, 'edittotal']);
Route::post("/camp/editdaily/{id}",   [AdCampigain::class, 'editdaily']);
Route::post("/camp/editdate/{id}",    [AdCampigain::class, 'editdate']);
Route::post("/camp/removeimage/{id}", [AdCampigain::class, 'removeImage']);
Route::post("/camp/deletecamp/{id}",  [AdCampigain::class, 'deleteCamp']);
Route::post('/camp/create',           [AdCampigain::class, 'create']);
Route::get("/camp/{id}", [AdCampigain::class, 'showCamp']);

Route::get('/{offset?}/{limit?}', [AdCampigain::class, 'index']);
