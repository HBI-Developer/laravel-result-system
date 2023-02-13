@extends('layout.login', ['type' => 'student'])

@section('form')

    <div class="icon">

        <div class="icon student-icon"></div>

    </div>

    <div class="user">الطالب</div>

    <input type="text" class="username" name="ssn" minlength="10" maxlength="10" placeholder="الرقم الوطني" />

    @error('ssn')

        <p class="error"> {{ $message }} </p>

    @enderror

    <input type="text" class="password" name="sitting_number" minlength="6" maxlength="6" placeholder="رقم الجلوس" />

    @error('sitting_number')

        <p class="error"> {{ $message }} </p>

    @enderror

    @if (Session('error'))

        <p class="error"> {{ Session('error') }} </p>

    @endif
    
@endsection