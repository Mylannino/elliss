@extends('layouts.app')

@section('content')
<div class="container">
        <div class="row py-4">

            <div class="col-md-4">
                <img src="{{ asset('/img/ellis-responsive-01.png') }}" alt="elliss" class="pb-3 d-block mx-auto d-md-none">
                <div class="card mijn-card">
                    <div class="card-body mijn-card-body">
                        <form method="POST" action="{{ route('register') }}">
                            @csrf

                            <div class="form-group">
                                <label for="name">{{ __('Name') }}</label>

                                <input id="name" type="text" class="form-control{{ $errors->has('name') ? ' is-invalid' : '' }}" name="name" value="{{ old('name') }}" required autofocus>
                                @if ($errors->has('name'))
                                    <span class="invalid-feedback">
                                    <strong>{{ $errors->first('name') }}</strong>
                                </span>
                                @endif
                        </div>

                            <div class="form-group">
                                <label for="email">{{ __('E-Mail Address') }}</label>

                                <input id="email" type="email" class="form-control{{ $errors->has('email') ? ' is-invalid' : '' }}" name="email" value="{{ old('email') }}" required>

                                @if ($errors->has('email'))
                                    <span class="invalid-feedback">
                                    <strong>{{ $errors->first('email') }}</strong>
                                </span>
                                @endif

                            </div>

                            <div class="form-group">
                                <label for="password">{{ __('Password') }}</label>

                                <input id="password" type="password" class="form-control{{ $errors->has('password') ? ' is-invalid' : '' }}" name="password" required>

                                @if ($errors->has('password'))
                                    <span class="invalid-feedback">
                                    <strong>{{ $errors->first('password') }}</strong>
                                </span>
                                @endif
                            </div>

                            <div class="form-group">
                                <label for="password-confirm">{{ __('Confirm Password') }}</label>

                                <input id="password-confirm" type="password" class="form-control" name="password_confirmation" required>

                            </div>

                            <div class="form-group">
                                    <button type="submit" class="btn main-knop-rond d-block mx-auto">
                                        <i class="fas fa-user-plus fa-4x"></i>
                                    </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div class="col-md-8">
                {{--Help icon om te togglen--}}
                <div class="row">
                    <div class="col-md-1">
                        <div class="help-icon mx-auto" id="help-knop">
                        <i class="fas fa-question fa-2x"></i>
                        </div>
                    </div>
                    <div class="col-md-11">
                        <h3 class="p-3">Hover on me for more informations</h3>
                    </div>
                </div>
                <div class="row">
                    <register-info-panel></register-info-panel>
                </div>
            </div>
        </div>
</div>
@endsection
