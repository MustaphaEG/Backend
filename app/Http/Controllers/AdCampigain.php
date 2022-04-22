<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\Campaign;
use App\Models\CampaignImage;
use Illuminate\Support\Str;

class AdCampigain extends Controller {

    private function authedUser($idUser) {
        if ($idUser != 1)
            return response()->json([
                        "state" => "error",
                        "errors" => ["User not authorized"]
            ]);
        return true;
    }

    public function index($offset = 0, $limit = 10) {

        $Camps = Campaign::all()->skip(max($offset, 0))->take(max(min($limit, 20), 5));
        return view("index", ["Camps" => $Camps]);
    }

    public function showCamp($id) {
        $Camp = Campaign::where("campaigns.id_campaign", $id)->first();
        $CampImages = CampaignImage::where("id_campaign", $id)->get();
        if ($Camp)
            return view("show", ["Camp" => $Camp, "CampImages" => $CampImages]);
        return abort(404);
    }

    public function editname(Request $request, int $id) {

        $Camp = Campaign::findOrFail($id);
        $OuthUser = $this->authedUser($Camp->id_user);
        if ($OuthUser !== true)
            return $OuthUser;
        $validator = Validator::make($request->all(), [
                    'CampName' => "required|string|between:2,20"
        ]);

        if ($validator->fails()) {
            return response()->json([
                        "state" => "error",
                        "errors" => $validator->messages()->toArray()
            ]);
        }
        Campaign::where("id_campaign", $id)
                ->update(['camp_name' => $request->input("CampName")]);

        return response()->json(["state" => "ok"]);
    }

    public function edittotal(Request $request, int $id) {
        $request->ip();
        $Camp = Campaign::findOrFail($id);
        $OuthUser = $this->authedUser($Camp->id_user);
        if ($OuthUser !== true)
            return $OuthUser;
        $validator = Validator::make($request->all(), [
                    'total' => "required|numeric|between:0,99.99",
        ]);

        if ($validator->fails()) {
            return response()->json([
                        "state" => "error",
                        "errors" => $validator->messages()->toArray()
            ]);
        }


        if ($Camp->budget_daily > $request->input("total")) {
            return response()->json([
                        "state" => "error",
                        "errors" => ["Total Budget should be above " . $Camp->budget_daily]
            ]);
        }


        Campaign::where("id_campaign", $id)
                ->update(['budget_total' => $request->input("total")]);

        return response()->json(["state" => "ok"]);
    }

    public function editdaily(Request $request, int $id) {

        $Camp = Campaign::findOrFail($id);
        $OuthUser = $this->authedUser($Camp->id_user);
        if ($OuthUser !== true)
            return $OuthUser;
        $validator = Validator::make($request->all(), [
                    'dailyBudget' => "required|numeric|between:0,99.99",
        ]);

        if ($validator->fails()) {
            return response()->json([
                        "state" => "error",
                        "errors" => $validator->messages()->toArray()
            ]);
        }

        if ($Camp->budget_total < $request->input("dailyBudget")) {
            return response()->json([
                        "state" => "error",
                        "errors" => ["Daily Budget should be less then " . $Camp->budget_total]
            ]);
        }
        Campaign::where("id_campaign", $id)
                ->update(['budget_total' => $request->input("dailyBudget")]);

        return response()->json(["state" => "ok"]);
    }

    public function removeImage(int $id) {

        $CampImage = CampaignImage::findOrFail($id);
        $Camp = Campaign::findOrFail($CampImage->id_campaign);

        $OuthUser = $this->authedUser($Camp->id_user);
        if ($OuthUser !== true)
            return $OuthUser;
        File::delete(public_path("userImage/" . $CampImage->image_path));
        $CampImage->delete();
        return response()->json(["state" => "ok"]);
    }

    public function deleteCamp(Request $request, int $id) {
        $Camp = Campaign::findOrFail($id);
        $OuthUser = $this->authedUser($Camp->id_user);
        if ($OuthUser !== true)
            return $OuthUser;

        $Images = CampaignImage::all()->where("id_campaign", $id);
        foreach ($Images as $OneImage) {
            File::delete(public_path("userImage/" . $OneImage->image_path));
            $OneImage->delete();
        }
        $Camp->delete();
        return response()->json(["state" => "ok"]);
    }

    public function create(Request $request) {

        $validator = Validator::make($request->all(), [
                    'CampName' => "required|string|between:2,20",
                    'file' => 'required',
                    'total' => "required|numeric|between:0,99.99",
                    'dailyBudget' => "required|numeric|between:0,99.99|lte:total",
                    'file.*' => "mimes:jpeg,png,jpg,gif,svg|max:2048",
                    'DateFrom' => "required|date_format:Y-m-d|after_or_equal:tomorrow",
                    'DateTo' => "required|date_format:Y-m-d|after:DateFrom",
        ]);

        if ($validator->fails()) {
            return response()->json([
                        "state" => "error",
                        "errors" => $validator->messages()->toArray()
            ]);
        }

        $idCamp = $this->createCamp($request);

        foreach ($request->file('file') as $Image) {
            $this->storeImage4Camp($idCamp, $Image);
        }
        return response()->json([
                    "state" => "ok",
                    "idCamp" => $idCamp,
                    "RedirectTo" => url("/camp/".$idCamp)
        ]);
    }

    private function createCamp(Request $request) {

        $Camp = new Campaign();
        $Camp->id_user = 1;
        $Camp->camp_name = $request->input("CampName");
        $Camp->budget_total = $request->input("total");
        $Camp->budget_daily = $request->input("dailyBudget");
        $Camp->date_from = $request->input("DateFrom");
        $Camp->date_to = $request->input("DateTo");
        $Camp->save();
        return $Camp->id_campaign;
    }

    private function storeImage4Camp($idCamp, $Image) {

        $ImageStorName = "1_" . $idCamp . "_" . time() . "_" . Str::random(16) . "." . $Image->getClientOriginalExtension();
        $CampImage = new CampaignImage();
        $CampImage->id_campaign = $idCamp;
        $CampImage->image_name = Str::substr($Image->getClientOriginalName(), 0, 255);
        $CampImage->image_path = $ImageStorName;
        $CampImage->save();
        $Image->move(public_path("userImage"), $ImageStorName);
        return $CampImage->id_campaign;
    }

}
