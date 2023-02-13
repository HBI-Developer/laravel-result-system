@extends('layout.login', ['type' => 'admin'])

@section('form')

    <div class="icon">

        <div class="icon user-icon"></div>

    </div>

    <div class="user">مسؤول النظام</div>

    <input type="text" class="username" name="username" placeholder="اسم المستخدم" />

    @error('username')

        <p class="error"> {{ $message }} </p>

    @enderror

    <input type="password" class="password" name="password" placeholder="كلمة المرور" />

    @error('password')

        <p class="error"> {{ $message }} </p>

    @enderror

    @if (Session('error'))

        <p class="error"> {{ Session('error') }} </p>

    @endif

@endsection