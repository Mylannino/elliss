@extends('layouts.app')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="zoeken-wrapper py-4  text-center">
            <div class="col-md-6 offset-md-3">
                <form action="{{route('home')}}" method="GET" id="form-zoeken">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1"><i class="fas fa-search"></i></span>
                        </div>
                        <input type="text" class="form-control" placeholder="Zoeken met de EAN nummer" aria-label="Zoeken" aria-describedby="Hier kunt op producten zoeken" name="ean">
                        <div class="input-group-append">
                            <input type="submit" value="Zoeken" class="btn btn-primary">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="hoe-werkt" id="infobalk">
        <div class="hoe-werkt-pijl"></div>
        Zoek een product met de EAN nummer van een artikel.
    </div>

    <div class="productshow">
        <div class="container">
            <div class="row ">
                @foreach($producten as $product)

                    <div class="col-md-4 offset-md-2">
                        <div class="product-foto">
                            <img src="{{ $product->url }}" alt="{{ $product->naam }}" class="img-fluid ">
                            <div class="aanbieding text-center">Aanbieding variable</div>
                        </div>
                    </div>
                    <div class="col-md-4 d-flex align-items-center">
                        <div class="product-content flex-column ">
                            @foreach($merken as $merk)
                            @if($product->merk == $merk->merk_naam)
                                <img src="{{ $merk->logo }}" alt="{{ $product->naam }}" class="d-inline-block" width="150">
                            @endif
                            @endforeach



                            <h4>{{ $product->naam }}</h4>
                            <p>{{ $product->omschrijving }}</p>
                                <form action="{{ url('/koppel-product/' . $product->id ) }}" method="POST" class="form-inline">
                                    @csrf
                                    <button type="submit" class="btn btn-primary btn-sm mr-2"><i class="fas fa-heart"></i> Toevoegen favorieten</button>
                                    <a href="{{route('slideshow')}}"><button type="button" class="btn btn-secondary btn-sm "><i class="fas fa-eye"></i> Check aanbieding</button></a>
                                </form>
                        </div>
                    </div>

                    {{--<div class="col-md-3">--}}
                    {{--<div class="card">--}}
                    {{--<img class="card-img-top" src="{{$product->url}}" alt="{{$product->naam}}">--}}
                    {{--<div class="card-body">--}}
                    {{--<h5 class="card-title">{{ $product->naam }}</h5>--}}
                    {{--<p class="card-text">{{ substr($product->omschrijving, 0, 50) . '...' }}</p>--}}
                    {{--<a href="#" class="btn btn-primary">Add to favorite</a>--}}
                    {{--</div>--}}
                    {{--</div>--}}
                    {{--</div>--}}


                @endforeach
            </div>
        </div>
    </div>


    {{--<div class="container">--}}
        {{--<div class="row">--}}

            {{--<form class="form-inline col" id="formulier">--}}
                {{--@csrf--}}
                {{--<div class="col-md-3">--}}
                    {{--<select name="category" id="category"  class="form-control kies-veld">--}}
                        {{--@foreach($categorys as $category)--}}
                            {{--<option value="{{ $category->category }}">{{ $category->category }}</option>--}}
                        {{--@endforeach--}}
                    {{--</select>--}}
                {{--</div>--}}
                {{--<div class="col-md-3">--}}
                    {{--<select name="soort" id="soort" class="form-control kies-veld">--}}
                        {{--@foreach($sorten as $soort)--}}
                            {{--<option value="{{ $soort->soort }}">{{ $soort->soort }}</option>--}}
                        {{--@endforeach--}}
                    {{--</select>--}}
                {{--</div>--}}
                {{--<div class="col-md-3">--}}
                    {{--<select name="merk" id="merk" class="form-control kies-veld">--}}
                        {{--@foreach($merken as $merk)--}}
                        {{--<option value="{{ $merk->merk }}">{{ $merk->merk }}</option>--}}
                        {{--@endforeach--}}
                    {{--</select>--}}
                {{--</div>--}}
                {{--<div class="col-md-3">--}}
                    {{--<div class="form-group">--}}
                        {{--<input type="submit" class="btn btn-primary btn-block" value="zoeken">--}}
                    {{--</div>--}}
                {{--</div>--}}








                {{--<div class="col-md-4">--}}
                    {{--<div class="category-knopen">--}}
                        {{--<button type="button" class="btn main-category-knop btn-lg btn-block ">Makeup</button>--}}
                        {{--<button type="button" class="btn main-category-knop btn-lg btn-block ">Haar</button>--}}
                        {{--<button type="button" class="btn main-category-knop btn-lg btn-block ">Huid</button>--}}
                        {{--<button type="button" class="btn main-category-knop btn-lg btn-block ">Geur</button>--}}
                    {{--</div>--}}
                    {{--<div class="category-info-ballon">--}}
                        {{--<div class="category-info-ballon-pijltje"></div>--}}
                        {{--<span class="text-center d-block">Kies uw category uit het lijst hierboven</span>--}}
                    {{--</div>--}}
                {{--</div>--}}
                {{--<div class="col-md-4">--}}
                    {{--<div class="product-type">--}}
                        {{--<div class="product-type-pijltje"></div>--}}
                        {{--<ul id="category">--}}
                            {{--@foreach($categorys as $category)--}}
                                {{--<li>{{ $category->soort }}</li>--}}
                            {{--@endforeach--}}
                        {{--</ul>--}}
                    {{--</div>--}}
                {{--</div>--}}
                {{--<div class="col-md-4">--}}
                    {{--<div class="product-type">--}}
                        {{--<div class="product-type-pijltje"></div>--}}
                        {{--<ul id="soort">--}}
                            {{--@foreach($merken as $merk)--}}
                                {{--<li>{{ $merk->merk }}</li>--}}
                            {{--@endforeach--}}
                        {{--</ul>--}}
                    {{--</div>--}}
                {{--</div>--}}
            {{--</form>--}}

        {{--</div>--}}

        {{--<div class="row">--}}
            {{--<div class="col py-4 text-center">--}}
                {{--<a href="{{route('slideshow')}}" class="btn btn-primary btn-block">Ga naar de slideshow</a>--}}
            {{--</div>--}}
        {{--</div>--}}
    {{--</div>--}}
</div>
@endsection
