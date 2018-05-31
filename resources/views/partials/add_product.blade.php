@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row py-4">
            <div class="col-md-6 offset-3">
                <div class="card mijn-card">
                    <div class="card-body mijn-card-body">
                        <form method="POST" action="{{ route('admin.add-product') }}" enctype="multipart/form-data">
                            @csrf

                            <div class="form-group">
                                <label for="ean">{{ __('Ean') }}</label>
                                <input id="ean" type="text" class="form-control{{ $errors->has('ean') ? ' is-invalid' : '' }}" name="ean" value="{{ old('ean') }}" placeholder="3600523215744" required autofocus>
                                @if ($errors->has('ean'))
                                    <span class="invalid-feedback">
                                        <strong>{{ $errors->first('ean') }}</strong>
                                    </span>
                                @endif
                            </div>

                            <div class="form-group">
                                <label for="product-image">Product foto</label>
                                <input type="file" class="form-control-file" name="photo" id="product-image">
                            </div>

                            <div class="form-group">
                                <label for="name">{{ __('Name') }}</label>
                                <input id="name" type="text" class="form-control{{ $errors->has('name') ? ' is-invalid' : '' }}" name="name" value="{{ old('name') }}" placeholder="Artikel naam"
                                       required autofocus>
                                @if ($errors->has('name'))
                                    <span class="invalid-feedback">
                                        <strong>{{ $errors->first('name') }}</strong>
                                    </span>
                                @endif
                            </div>

                            <div class="form-group">
                                <label for="merk">{{ __('Merk') }}</label>
                                <select name="merk" id="merk" class="custom-select{{ $errors->has('merk') ? ' is-invalid' : '' }}" required>
                                    <option selected> Kies je merk</option>
                                    @foreach($merken as $merk)
                                        <option value="{{ $merk->merk }}">{{ $merk->merk }}</option>
                                    @endforeach
                                </select>
                                @if ($errors->has('merk'))
                                    <span class="invalid-feedback">
                                        <strong>{{ $errors->first('merk') }}</strong>
                                    </span>
                                @endif
                            </div>

                            <div class="form-group">
                                <label for="category">{{ __('Category') }}</label>
                                <select name="category" id="category" class="custom-select{{ $errors->has('category') ? ' is-invalid' : '' }}" required>
                                    <option selected> Kies je Category</option>
                                    @foreach($categorys as $category)
                                        <option value="{{ $category->category }}">{{ $category->category }}</option>
                                    @endforeach
                                </select>
                                @if ($errors->has('category'))
                                    <span class="invalid-feedback">
                                        <strong>{{ $errors->first('category') }}</strong>
                                    </span>
                                @endif
                            </div>

                            <div class="form-group">
                                <label for="soort">{{ __('Soort') }}</label>
                                <select name="soort" id="soort" class="custom-select{{ $errors->has('soort') ? ' is-invalid' : '' }}" required>
                                    <option selected> Kies je soort</option>
                                    @foreach($soorts as $soort)
                                        <option value="{{ $soort->soort }}">{{ $soort->soort }}</option>
                                    @endforeach
                                </select>
                                @if ($errors->has('soort'))
                                    <span class="invalid-feedback">
                                        <strong>{{ $errors->first('soort') }}</strong>
                                    </span>
                                @endif
                            </div>

                            <div class="form-group">
                                <label for="van">{{ __('Drogist') }}</label>
                                <select name="" id="" class="form-control">
                                    <option value="" selected>Kies...</option>
                                    <option value="">Kruidvat</option>
                                    <option value="">Duo</option>
                                </select>
                                @if ($errors->has('van'))
                                    <span class="invalid-feedback">
                                        <strong>{{ $errors->first('Van en Tot') }}</strong>
                                    </span>
                                @endif
                            </div>

                            <div class="form-group">
                                <label for="van">{{ __('Aanbieding') }}</label>
                                <select name="" id="" class="form-control">
                                    <option value="" selected>Kies...</option>
                                    <option value="">1 + 1 gratis</option>
                                    <option value="">2de gratis</option>
                                </select>
                                @if ($errors->has('van'))
                                    <span class="invalid-feedback">
                                        <strong>{{ $errors->first('Van en Tot') }}</strong>
                                    </span>
                                @endif
                            </div>

                            <div class="form-group">
                                <label for="van">{{ __('Van en Tot') }}</label>
                                <div class="input-group input-daterange">
                                    <input type="text" class="form-control" value="dag/maand/jaar">
                                    <div class="input-group-addon">to</div>
                                    <input type="text" class="form-control" value="dag/maand/jaar">
                                </div>
                                @if ($errors->has('van'))
                                    <span class="invalid-feedback">
                                        <strong>{{ $errors->first('Van en Tot') }}</strong>
                                    </span>
                                @endif
                            </div>

                            <div class="form-group">
                                <label for="omschrijving">{{ __('Omschrijving') }}</label>
                                <textarea name="omschrijving" id="omschrijving" class="form-control{{ $errors->has('omschrijving') ? ' is-invalid' : '' }}"></textarea>
                            </div>


                            <div class="form-group">
                                <button type="submit" class="btn btn-primary">
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col">
                @if(session('success'))
                    <div class="aler alert-success success">
                        {{ session('success') }}
                    </div>
                @endif
            </div>
        </div>
    </div>

@endsection

