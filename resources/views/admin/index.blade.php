<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="shortcut icon" href="{{asset('images/logo.svg')}}" type="image/x-icon">
    <title>مسؤول النظام</title>

    <link rel="stylesheet" href="{{asset('css/general.css')}}">
    <link rel="stylesheet" href="{{asset('css/icons.css')}}">
    <link rel="stylesheet" href="{{asset('css/website/general/header-index.css')}}">
    <link rel="stylesheet" href="{{asset('css/website/general/time-picker.css')}}">
    <link rel="stylesheet" href="{{asset('css/website/admin/admin-index.css')}}">

</head>

<body>

    <section class="page">

        @include('include.header-index')

        <div class="container">

            <div class="sidebar">

                <div class="option clock">

                    <div class="icon clock-icon"></div>

                </div>

            </div>

            <div class="option clock">

                <div class="icon clock-icon"></div>

            </div>

            <div class="options">

                <a class="option statistics" href="{{route('statistics')}}">
                    <div class="icon statistics-icon"></div>
                    <div class="name">احصائيات</div>
                </a>

                <a class="option students" href="{{route('students')}}">
                    <div class="icon student-icon"></div>
                    <div class="name">الطلاب</div>
                </a>

                <a class="option subjects" href="{{route('subjects')}}">
                    <div class="icon subjects-icon"></div>
                    <div class="name">المقررات الدراسية</div>
                </a>

                <a class="option degrees" href="{{route('degrees')}}">
                    <div class="icon bookmark-icon"></div>
                    <div class="name">الدرجات</div>
                </a>

            </div>

        </div>

        <div class="cover">

            @include('include.time-picker')

        </div>

    </section>

    <script src="{{asset('js/vendor/jQuery.js')}}"></script>
    <script src="{{asset('js/website/general/timePicker.js')}}" type="module"></script>
    <script src="{{asset('js/website/admin/adminIndex.js')}}" type="module"></script>

</body>

</html>