<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class UserController extends Controller
{
    function create(Request $Req){
        
         $validator = Validator::make($Req->all(), [
                    'userName' => "required|string|between:2,20",
                    'userpass' => 'required',
                    'userMail' => "required|email"
        ]);

        if ($validator->fails()) {
            return response()->json([
                        "state" => "error",
                        "errors" => $validator->messages()->toArray()
            ]);
        }
        $idCamp = $this->createCamp($Req);
        return response()->json([
                    "state" => "ok",
                    "idCamp" => $idCamp,
                    "RedirectTo" => url("/camp/".$idCamp)
        ]);
        
    }
}
