@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col">
            <div id="demo" class="bee3D--parent">
                @foreach($producten as $product)
                <section class="bee3D--slide text-center">
                    <div class="row">
                        <div class="col">
                            @if($product->url != null)
                            <img src="{{$product->url}}" alt="{{ $product->naam}}" class="product-image">
                            @elseif(substr($product->url, 0, 4) === 'image')
                            <img src="{{asset('storage/' . $product->url)}}" alt="{{ $product->naam}}" class="product-image">
                            @else
                            <img src="http://via.placeholder.com/380x380" alt="{{ $product->naam}}" class="product-image">
                            @endif
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <h4 class="text-center p-3 slide-pro-naam">{{$product->naam}}</h4>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <a href="" class="knop"><i class="far fa-star"></i></a>
                            <img src="{{asset('img/drogist/diologo.png')}}" alt="" class="drogist-logo">
                            <h4 class="product-aanbieding d-inline-block">1+1=Gratis</h4>
                            <a href="" class="knop"><i class="far fa-question-circle"></i></a>
                        </div>
                    </div>
                </section>
                @endforeach
            </div>
        </div>
    </div>
</div>
@endsection