<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="shortcut icon" href="{{asset('images/logo.svg')}}" type="image/x-icon">
        <title>{{ Auth::guard('student')->user()->full_name }}</title>
        <link rel="stylesheet" href="{{asset('css/general.css')}}">
        <link rel="stylesheet" href="{{asset('css/icons.css')}}">
        <link rel="stylesheet" href="{{asset('css/website/student/certificate.css')}}">
    </head>

    <body>

        <div class="print-certificate">

            <div class="certificate">

                <div class="container">

                    <div class="head">

                        <div class="icon ministry-icon"></div>

                        <div class="ministry-info">

                            <p>جمهورية السودان</p>

                            <p>وزارة التربية والتعليم</p>

                        </div>

                        <div class="ministry-info">

                            <p>Republic of the Sudan</p>

                            <p>Ministry of Education</p>

                        </div>

                        <div class="icon ministry-icon"></div>

                    </div>

                    <div class="body">

                        <div class="student-info">

                            <div class="name">الاسم: {{ Auth::guard('student')->user()->full_name }} </div>

                            <div class="major">التخصص: {{ Auth::guard('student')->user()->specialization }} </div>

                            <div class="state">الولاية: {{ Auth::guard('student')->user()->state }} </div>

                            <div class="school">المدرسة: {{ Auth::guard('student')->user()->school }} </div>

                        </div>

                        <div class="degrees-table">

                            <div class="details">

                                <div class="column title">المادة</div>

                                <div class="column title">الدرجة</div>

                                @foreach ($student as $degree)

                                    <div class="column"> {{ $degree->subject->subject_name }} </div>

                                    <div class="column">{{ $degree->degree }}%</div>

                                @endforeach

                            </div>

                            <div class="final">

                                <div class="column">الدرجة الكلية</div>

                                <div class="column">{{ round($degree->avg('degree'), 2) }}%</div>

                            </div>

                        </div>

                        <div class="statistics">

                            @foreach ($statistics as $statistic)

                                <div class="box">

                                    <div class="title"> {{ $statistic["subject"] }} </div>
                                    
                                    <div class="staticstic">

                                        <div class="row">معدل الطالب</div>

                                        <div class="row with-columns">

                                            <div class="column">

                                                <div class="progress" style="--width: {{ $statistic["student"] }}%; --background: #03A9F4;"></div>

                                            </div>

                                            <div class="column">{{ $statistic["student"] }}%</div>

                                        </div>

                                        <div class="row">متوسط معدل الولاية</div>

                                        <div class="row with-columns">

                                            <div class="column">

                                                <div class="progress" style="--width: {{ $statistic["state"] }}%; --background: #4CAF50;"></div>

                                            </div>

                                            <div class="column">{{ $statistic["state"] }}%</div>

                                        </div>

                                        <div class="row">متوسط معدل السودان</div>

                                        <div class="row with-columns">

                                            <div class="column">

                                                <div class="progress" style="--width: {{ $statistic["all"] }}%; --background: #EF5350;"></div>
                                            
                                            </div>

                                            <div class="column">{{ $statistic["all"] }}%</div>

                                        </div>

                                    </div>

                                </div>

                            @endforeach

                        </div>

                    </div>

                </div>

                <div class="warning">
                    أي تعديل أو إضافة أو حذف في هذه الوثيقة يلغيها
                </div>

            </div>

        </div>

    </body>

</html>