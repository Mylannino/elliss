<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use App\Product;
use App\Merk;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
//        $productsCategory = Product::all('soort')->unique('soort');
//        $productsmerken = Product::all('merk')->unique('merk');

        $category = Product::all('category')->unique('category');
        $soort = Product::all('soort')->unique('soort')->where('category', '=', $request->category);
        $merk = Product::all('merk')->unique('merk')->where('soort', '=', $request->soort);

        $test = $request->soortoption;

        $product = Product::all()->where('ean', '=', $request->ean);

        $merk = Merk::all();


        return view('home', ['categorys' => $category, 'sorten' => $soort, 'merken' => $merk, 'producten' => $product, 'merken' => $merk]);
    }

    public function koppelToUser($id){

        $product = Product::find($id);
        $user = User::find(Auth::user()->id);
        $user->products()->attach($product->id);

        return view('test');
    }

    public function slideshow(){
        $product = Product::all();
        return view('/partials/slideshow', ['producten' => $product]);
    }

}
