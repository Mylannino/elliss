<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name', 'Elliss') }}</title>

        <link rel="stylesheet" href="{{  mix('css/app.css')}}">
    </head>
    <body>
        <div class="full-height d-flex flex-column align-items-center justify-content-center">
            <div class="welcome-overlay"></div>
            <div class="flex-row">
                <div class="col">
                    <img src="{{asset('/img/ellis-banner-2.png')}}" alt="elliss.nl" class="img-fluid my-5">
                </div>
            </div>
            <div class="flex-row align-items-center">
                <div class="col">
                    <div class="register-login text-center">
                        @if (Route::has('login'))
                            @auth
                                <a href="{{ url('/home') }}">Home</a>
                            @else
                                <a href="{{ route('login') }}" class="mb-2">Login</a>
                                <a href="{{ route('register') }}">Register</a>
                            @endauth
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
