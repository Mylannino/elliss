@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col py-4"><a href="{{route('admin.add-product-form')}}" class="btn btn-primary">Add new product</a></div>
            <div class="col"></div>
        </div>
    </div>
@endsection
