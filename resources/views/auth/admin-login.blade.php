@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row py-5">
        <div class="col-md-4 offset-md-4">
            <div class="card mijn-card">
                <div class="card-body mijn-card-body">
                    <form method="POST" action="{{ route('admin.login.submit') }}">
                        @csrf

                        <div class="form-group">
                            <label for="email">{{ __('E-Mail Address') }}</label>

                                <input id="email" type="email" class="form-control{{ $errors->has('email') ? ' is-invalid' : '' }}" name="email" value="{{ old('email') }}" required autofocus>

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
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" name="remember" {{ old('remember') ? 'checked' : '' }}> {{ __('Remember Me') }}
                                </label>
                            </div>
                        </div>

                        <div class="form-group">
                                <button type="submit" class="btn main-knop-rond d-block mx-auto">
                                    <i class="fas fa-unlock-alt fa-4x"></i>
                                </button>

                                <a class="btn btn-link d-block mx-auto mt-3" href="{{ route('password.request') }}">
                                    {{ __('Forgot Your Password?') }}
                                </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        {{--<div class="col-md-8">--}}
            {{--<div class="row">--}}
                {{--<div class="col-md-1">--}}
                    {{--<div class="help-icon mx-auto" id="help-knop">--}}
                        {{--<i class="fas fa-question fa-2x"></i>--}}
                    {{--</div>--}}
                {{--</div>--}}
                {{--<div class="col-md-11">--}}
                    {{--<h3 class="p-3">Hover on me for more informations</h3>--}}
                {{--</div>--}}
            {{--</div>--}}
            {{--<div class="row">--}}
                {{--<login-info-panel></login-info-panel>--}}
            {{--</div>--}}
        {{--</div>--}}
    </div>
</div>
@endsection
