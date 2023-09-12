@extends('layout.admin-pages')

@section('title', 'الدرجات')

@section('css')
<link rel="stylesheet" href="{{asset('css/website/admin/degrees.css')}}">
@endsection

@section('container')

<div class="details-degrees">

    <div class="table-head">الدرجات بالتفصيل</div>

    @include('include.list', ['type' => 'state','all' => true])

    <div class="details">

        @forelse ($degrees as $degree)

        <div class="student" data-ssn="{{ $degree->ssn }}">

            <div class="info-name">

                <div class="open-arrow">&langle;</div>

                <div class="title">

                    <div class="name">

                        {{ $degree->first_name . ' ' . $degree->middle_name . ' ' . $degree->last_name }}

                    </div>

                    <div class="options">

                        <div class="edit">

                            <div class="icon edit-icon"></div>

                        </div>

                        <div class="delete">&minus;</div>

                    </div>

                </div>

            </div>

            <div class="info">

                @foreach ($degree->degrees as $degree2)

                <div class="name">{{ $degree2->subject->subject_name }}</div>

                <div class="value">{{ $degree2->degree }}%</div>

                @endforeach

            </div>

        </div>

        @empty

        <div class="nothing">
            لا توجد درجات مسجلة حتى الآن.
        </div>

        @endforelse

    </div>

    <div class="add">&plus;</div>

    @if ($degrees->hasPages())

    <div class="pagination">

        <div class="prev {{ $degrees->currentPage() <= 1 ? 'disabled' : '' }}">&langle;</div>

        <div class="pages">

            <div class="current">{{ $degrees->currentPage() }}</div>

            <span>/</span>

            <div class="pages-number">{{ $degrees->lastPage() }}</div>

        </div>

        <div class="next {{ $degrees->currentPage() >= $degrees->lastPage() ? 'disabled' : '' }}">&rangle;</div>

    </div>

    @else

    <div class="footer-table"></div>

    @endif

    <div class="wait-table"></div>

</div>

<div class="final-degrees">

    <div class="table-head">درجات الطلاب</div>

    @include('include.list', ['type' => 'state','all' => true])

    <div class="degrees">

        <div class="student title">اسم الطالب</div>

        <div class="degree title">الدرجة الكلية</div>

        @forelse ($final as $degree)

        <div class="student"> {{ $degree->first_name . ' ' . $degree->middle_name . ' ' . $degree->last_name }} </div>

        <div class="degree">{{ $degree->degree }}%</div>

        @empty

        <div class="nothing">
            لا يوجد درجات مسجلة حتى الآن
        </div>

        @endforelse

    </div>

    @if ($final->hasPages())

    <div class="pagination">

        <div class="prev {{ $final->currentPage() <= 1 ? 'disabled' : '' }}">&langle;</div>

        <div class="pages">

            <div class="current">{{ $final->currentPage() }}</div>

            <span>/</span>

            <div class="pages-number">{{ $final->lastPage() }}</div>

        </div>

        <div class="next {{ $final->currentPage() >= $final->lastPage() ? 'disabled' : '' }}">&rangle;</div>

    </div>

    @else

    <div class="footer-table"></div>

    @endif

    <div class="wait-table"></div>

</div>

<div class="cover">

    <div class="add-degree">

        <div class="table-head">أضف درجات طالب</div>

        @if ($students_without_degrees->count() > 0)

        <div class="select-input students list-container">

            <div class="selected">

                <div class="open-arrow">&langle;</div>

                <div class="name" data-option="{{ $students_without_degrees[0]->ssn }}">{{
                    $students_without_degrees[0]->first_name . ' ' . $students_without_degrees[0]->middle_name . ' ' .
                    $students_without_degrees[0]->last_name }}</div>

            </div>

            <div class="list">

                @foreach ($students_without_degrees as $student)

                <div class="option" data-major="{{ $student->specialization }}" data-option="{{ $student->ssn }}">{{
                    $student->first_name . ' ' . $student->middle_name . ' ' . $student->last_name }}</div>

                @endforeach

            </div>

        </div>

        @endif

        <div class="degrees">

            @if ($students_without_degrees->count() > 0)

            <div class="error"></div>

            @foreach ($subjects as $subject)

            <div class="label">{{ $subject->subject_name }}</div>

            <input type="text" class="theDegree" data-id="{{ $subject->id }}" />

            <div class="error"></div>

            @endforeach

            @else

            <div class="nothing">لقد تم وضع الدرجات لجميع الطلاب المسجلين في النظام حتى الآن</div>

            @endif

        </div>

        <div class="buttons">

            <div class="send">
                <p>إرسال البيانات</p>
                <div class="dots">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>

            <div class="cancel">إلغاء الأمر</div>

        </div>

    </div>

</div>

@endsection

@section('confirm')
هل أنت متأكد من أنك تريد حذف هذه الدرجات من النظام؟
@endsection

@section('js')
<script src="{{asset('js/website/admin/degrees.js')}}" type="module"></script>
@endsection