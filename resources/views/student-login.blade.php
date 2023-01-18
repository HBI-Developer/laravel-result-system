
{{-- Use login layout with student as type --}}

@extends('layout.login', ['type' => 'student'])

@section('form')

    {{-- Template of form --}}

    <div class="icon">
        <div class="icon student-icon"></div>
    </div>

    <div class="user">الطالب</div>

    <input type="text" class="username" name="ssn" minlength="10" maxlength="10" placeholder="الرقم الوطني" />

    @error('ssn')

        {{-- If there's error for ssn --}}

        <p class="error"> {{ $message }} </p>

    @enderror

    <input type="text" class="password" name="sitting_number" minlength="6" maxlength="6" placeholder="رقم الجلوس" />

    @error('sitting_number')

        {{-- If there's error for sitting number --}}

        <p class="error"> {{ $message }} </p>

    @enderror

    @if (Session('error'))

        {{-- If there's error --}}

        <p class="error"> {{ Session('error') }} </p>

    @endif
    
@endsection