
{{-- Use admin-page layout --}}

@extends('layout.admin-pages')

{{-- Assign title of page --}}

@section('title', 'الإحصائيات')

{{-- Add file of css in page --}}

@section('css')
    <link rel="stylesheet" href="{{asset('css/website/admin/statistics.css')}}">
    <link rel="stylesheet" href="{{asset('css/website/general/list.css')}}">
@endsection

{{-- Add elements in container section --}}

@section('container')

    <div class="subjects-statistics"> {{-- Subjects Statistics start --}}

        <div class="title">نسبة النجاح بالنسبة للمواد</div>

        <div class="statistics-table"> {{-- Statistics table start --}}

            {{-- Table head --}}

            <div class="table-head">المواد</div>
            <div class="table-head">الإحصائيات</div>
            <div class="table-head">النسبة المئوية</div>

            {{-- include state list-container with (all option) --}}
            
            @include('include.list', ['type' => 'state','all' => true])

            {{-- Forelse to put Statistics --}}

            @forelse ($details_statistics as $statistic)

                {{-- If there's Statistics --}}

                <div class="subject">{{ $statistic['subject'] }}</div>

                <div class="statistic">

                    {{-- Statistics for males, females, both to each subject --}}

                    <div class="male origin" style="width: {{ $statistic['males'] }}%" data-percent="{{ $statistic['males'] }}"></div>

                    <div class="female origin" style="width: {{ $statistic['females'] }}%" data-percent="{{ $statistic['females'] }}"></div>

                    <div class="all origin active" style="width: {{ $statistic['all'] }}%" data-percent="{{ $statistic['all'] }}"></div>

                </div>

                {{-- Percentage both statistic as default --}}

                <div class="percentage">{{ $statistic['all'] }}%</div>

            @empty

                {{-- If there's not Statistics --}}

                <div class="nothing">
                    لا يمكن بناء الإحصائيات لعدم توفر المعلومات الكافية، تأكد من توفر بيانات
                    الطلاب والمواد ودرجات الطلاب.
                </div>

            @endforelse

        </div> {{-- Statistics table end --}}

        {{-- Keys for statistics table --}}

        <div class="key-statistics">

            <div class="key">
                <span>الذكور:</span><span class="square"></span>
            </div>

            <div class="key">
                <span>الإناث:</span><span class="square" style="--background: #EC407A;"></span>
            </div>

            <div class="key">
                <span>الكل:</span><span class="square" style="--background: #66BB6A;"></span>
            </div>

        </div>

        {{-- Wait element in table --}}

        <div class="wait-table"></div>

    </div> {{-- Subjects Statistics end --}}

    <div class="gender-statistics"> {{-- Gender statistics start --}}

        <div class="title">نسبة النجاح بالنسبة للطلاب</div>

        <div class="statistics"> {{-- statistics start --}}

            <div class="statistic-box"> {{-- statistics box start --}}

                <div class="gender">ذكور</div>

                <div class="percentage">

                    <div class="circle" style="--gradient-color: #29B6F6;"></div>
                    <div class="small-circle">{{ $total_statistics['males'] }}%</div>
                    <div class="cover-one" style="--degree: {{ ($total_statistics['males'] / 100) * 360 }}deg"></div>
                    <div class="cover-two"></div>

                </div>

            </div> {{-- statistics box end --}}

            <div class="statistic-box"> {{-- statistics box start --}}

                <div class="gender">إناث</div>

                <div class="percentage">

                    <div class="circle" style="--gradient-color: #EC407A;"></div>
                    <div class="small-circle">{{ $total_statistics['females'] }}%</div>
                    <div class="cover-one" style="--degree: {{ ($total_statistics['females'] / 100) * 360 }}deg"></div>
                    <div class="cover-two"></div>

                </div>

            </div> {{-- statistics box end --}}

            <div class="statistic-box"> {{-- statistics box start --}}

                <div class="gender">الكل</div>

                <div class="percentage">

                    <div class="circle" style="--gradient-color: #66BB6A;"></div>
                    <div class="small-circle">{{ $total_statistics['all'] }}%</div>
                    <div class="cover-one" style="--degree: {{ ($total_statistics['all'] / 100) * 360 }}deg"></div>
                    <div class="cover-two"></div>

                </div>

            </div> {{-- statistics box end --}}

        </div> {{-- statistics start --}}

    </div> {{-- Gender statistics end --}}

@endsection

{{-- Add file of js in page --}}

@section('js')
    <script src="{{ asset('js/website/admin/statistics.js') }}"></script>
@endsection