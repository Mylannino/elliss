<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use App\Product;

class AdminController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:admin');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('admin');
    }
    public function create(){

        $merken = Product::all('merk')->unique('merk');
        $categorys = Product::all('category')->unique('category');
        $soorts = Product::all('soort')->unique('soort');

        return view('partials.add_product', ['merken' => $merken, 'categorys' => $categorys, 'soorts' => $soorts]);
    }

    public function store(Request $request){

        $product = new Product();
        $product->ean = $request->ean;
        if($request->hasFile('photo')){
            $product->url = $request->photo->store('image');
        }
        $product->naam = $request->name;
        $product->omschrijving = $request->omschrijving;
        $product->category = $request->category;
        $product->soort = $request->soort;
        $product->merk = $request->merk;
        $product->save();

        return redirect()->back()->with('success', 'Uw product is met success toegevoegd');

    }

}
