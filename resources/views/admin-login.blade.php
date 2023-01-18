
{{-- Use login layout with admin as type --}}

@extends('layout.login', ['type' => 'admin'])

@section('form')

    {{-- Template of form --}}

    <div class="icon">
        <div class="icon user-icon"></div>
    </div>

    <div class="user">مسؤول النظام</div>

    <input type="text" class="username" name="username" placeholder="اسم المستخدم" />

    @error('username')

        {{-- If there's error for username --}}

        <p class="error"> {{ $message }} </p>

    @enderror

    <input type="password" class="password" name="password" placeholder="كلمة المرور" />

    @error('password')

        {{-- If there's error for password --}}

        <p class="error"> {{ $message }} </p>
        
    @enderror

    @if (Session('error'))

        {{-- If there's error --}}

        <p class="error"> {{ Session('error') }} </p>

    @endif

@endsection