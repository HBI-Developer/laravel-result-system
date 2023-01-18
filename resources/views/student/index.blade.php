<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="shortcut icon" href="{{asset('images/logo.svg')}}" type="image/x-icon">

    {{-- Title is first name for student --}}

    <title>{{ Auth::guard('student')->user()->first_name }}</title>


    <link rel="stylesheet" href="{{asset('css/general.css')}}">
    <link rel="stylesheet" href="{{asset('css/icons.css')}}">
    <link rel="stylesheet" href="{{asset('css/website/general/header-index.css')}}">
    <link rel="stylesheet" href="{{asset('css/website/general/page-title.css')}}">
    <link rel="stylesheet" href="{{asset('css/website/student/student-index.css')}}">
</head>

<body>

    <section class="page">

        {{-- Include header --}}

        @include('include.header-index')

        <div class="container">

            @if (isset($diff))

                {{-- If there's time until system open --}}

                <div class="until-open">
                    <div class="text">بقي حتى عرض النتائج:</div>
                    <div class="time"> {{ $diff[0] < 10 ? '0' . $diff[0] : $diff[0] }} </div>
                    <span>:</span>
                    <div class="time"> {{ $diff[1] < 10 ? '0' . $diff[1] : $diff[1] }} </div>
                    <span>:</span>
                    <div class="time"> {{ $diff[2] < 10 ? '0' . $diff[2] : $diff[2] }} </div>
                    <span>:</span>
                    <div class="time"> {{ $diff[3] < 10 ? '0' . $diff[3] : $diff[3] }} </div>
                </div>

            @elseif(isset($degrees))

            {{-- Else if this student has degrees --}}

            <div class='to-back'>
                <div class="page-title"> {{ Auth::guard('student')->user()->full_name }} </div>
            </div>

            <div class="degrees-table">

                <div class="table-head">الدرجات</div>

                <div class="degrees">

                  <div class="details">

                    <div class="column title">المادة</div>
                    <div class="column title">الدرجة</div>
                    
                    @foreach ($degrees as $degree)

                    {{-- Put each subject its degree --}}

                        <div class="column">{{ $degree->subject->subject_name }}</div>
                        <div class="column">{{ $degree->degree }}</div>
                    @endforeach

                  </div>

                  <div class="final">

                    {{-- Avarage of student degrees --}}

                    <div class="column title">الدرجة الكلية</div>
                    <div class="column title">{{ $total }}%</div>

                  </div>

                </div>

                <a class="print-button" href="{{ Route('student.certificate') }}">
                  <div class="icon print-icon"></div>
                </a>

              </div>

            @else

              {{-- Else append student hasn't degrees template --}}

                <div class="no-degrees">
                    <div class="nothing">لم يتم وضع درجاتك بعد، عد لاحقاً من فضلك.</div>
                </div>

            @endif

        </div>

    </section>

    <script src="{{asset('js/vendor/jQuery.js')}}"></script>
    <script src="{{asset('js/website/general.js')}}"></script>

    <script>

        function timeDecrease() {

            // @variable untilOpen has time to open system from DB or 0
            // @variable time contains diffrent berween untilOpen and current time

            let untilOpen = {{ isset($diff[4]) ? $diff[4] : 0 }},
                time = diffrentFromNow(untilOpen, true);


            if (time !== 0) {

                // If time don't equal 0

                for (let i = 0; i < time.length; i++) {

                    // Put indexes of time array in time elements

                    $(".container .until-open .time").eq(i).text(time[i]);
                }

            } else {

                // if time equal 0

                // Put 00 in time elements

                $(".container .until-open .time").text('00');
            }

            setTimeout(() => {

                // After all above commands end

                if (time !== 0) {

                    // If time not equal 0

                    // Recursion

                    timeDecrease();

                } else {

                    // Else reload page

                    location.reload();
                }

            }, 0);
        }

        if ({{ isset($diff) ? 1 : 0 }}) {

            // If $diff exist

            // Execute timeDecrease function

            timeDecrease();
        }

    </script>
</body>
</html>