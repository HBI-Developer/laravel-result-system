@extends('layout.admin-pages')

@section('title', 'الإحصائيات')

@section('css')
    <link rel="stylesheet" href="{{asset('css/website/admin/statistics.css')}}">
    <link rel="stylesheet" href="{{asset('css/website/general/list.css')}}">
@endsection

@section('container')

    <div class="subjects-statistics">

        <div class="title">نسبة النجاح بالنسبة للمواد</div>

        <div class="statistics-table">

            <div class="table-head">المواد</div>

            <div class="table-head">الإحصائيات</div>

            <div class="table-head">النسبة المئوية</div>

            @include('include.list', ['type' => 'state','all' => true])

            @forelse ($details_statistics as $statistic)

                <div class="subject">{{ $statistic['subject'] }}</div>

                <div class="statistic">

                    <div class="male origin" style="width: {{ $statistic['males'] }}%" data-percent="{{ $statistic['males'] }}"></div>

                    <div class="female origin" style="width: {{ $statistic['females'] }}%" data-percent="{{ $statistic['females'] }}"></div>

                    <div class="all origin active" style="width: {{ $statistic['all'] }}%" data-percent="{{ $statistic['all'] }}"></div>

                </div>

                <div class="percentage">{{ $statistic['all'] }}%</div>

            @empty

                <div class="nothing">
                    لا يمكن بناء الإحصائيات لعدم توفر المعلومات الكافية، تأكد من توفر بيانات
                    الطلاب والمواد ودرجات الطلاب.
                </div>

            @endforelse

        </div>

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

        <div class="wait-table"></div>

    </div>

    <div class="gender-statistics">

        <div class="title">نسبة النجاح بالنسبة للطلاب</div>

        <div class="statistics">

            <div class="statistic-box">

                <div class="gender">ذكور</div>

                <div class="percentage">

                    <div class="circle" style="--gradient-color: #29B6F6;"></div>

                    <div class="small-circle">{{ $total_statistics['males'] }}%</div>

                    <div class="cover-one" style="--degree: {{ ($total_statistics['males'] / 100) * 360 }}deg"></div>

                    <div class="cover-two"></div>

                </div>

            </div>

            <div class="statistic-box">

                <div class="gender">إناث</div>

                <div class="percentage">

                    <div class="circle" style="--gradient-color: #EC407A;"></div>

                    <div class="small-circle">{{ $total_statistics['females'] }}%</div>

                    <div class="cover-one" style="--degree: {{ ($total_statistics['females'] / 100) * 360 }}deg"></div>

                    <div class="cover-two"></div>

                </div>

            </div>

            <div class="statistic-box">

                <div class="gender">الكل</div>

                <div class="percentage">

                    <div class="circle" style="--gradient-color: #66BB6A;"></div>

                    <div class="small-circle">{{ $total_statistics['all'] }}%</div>

                    <div class="cover-one" style="--degree: {{ ($total_statistics['all'] / 100) * 360 }}deg"></div>

                    <div class="cover-two"></div>

                </div>

            </div>

        </div>

    </div>

@endsection

@section('js')
    <script src="{{ asset('js/website/admin/statistics.js') }}"></script>
@endsection