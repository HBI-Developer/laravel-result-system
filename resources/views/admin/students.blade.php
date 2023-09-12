@extends('layout.admin-pages')

@section('title', 'الطلاب')

@section('css')
<link rel="stylesheet" href="{{asset('css/website/admin/students.css')}}">
@endsection

@section('container')

<div class="students-table">

    <div class="table-head">جدول الطلاب</div>

    @include('include.list', ['type' => 'state','all' => true])

    @forelse ($students as $student)

    <div class="student">

        <div class="info-name">

            <div class="open-arrow">&langle;</div>

            <div class="title">

                <div class="name">
                    <span>{{ $student->first_name }} </span>
                    <span>{{ $student->middle_name }} </span>
                    <span>{{ $student->last_name }}</span>
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

            <div class="name">الرقم الوطني</div>
            <div class="value">{{ $student->ssn }}</div>

            <div class="name">العمر</div>
            <div class="value">{{ $student->age }}</div>

            <div class="name">الجنس</div>
            <div class="value">{{ $student->gender }}</div>

            <div class="name">المدرسة</div>
            <div class="value">{{ $student->school }}</div>

            <div class="name">الولاية</div>
            <div class="value">{{ $student->state }}</div>

            <div class="name">رقم الجلوس</div>
            <div class="value">{{ $student->sitting_number }}</div>

            <div class="name">التخصص</div>
            <div class="value">{{ $student->specialization }}</div>

        </div>

    </div>

    @empty

    <div class="nothing">
        <div class="message">لا يوجد أي طلاب مسجلين حتى الآن</div>
    </div>

    @endforelse

    <div class="add">&plus;</div>

    @if ($students->hasPages())

    <div class="pagination">

        <div class="prev {{ $students->currentPage() <= 1 ? 'disabled' : '' }}">&langle;</div>

        <div class="pages">

            <div class="current">{{ $students->currentPage() }}</div>

            <span>/</span>

            <div class="pages-number">{{ $students->lastPage() }}</div>

        </div>

        <div class="next {{ $students->currentPage() >= $students->lastPage() ? 'disabled' : '' }}">&rangle;</div>

    </div>

    @else

    <div class="footer-table"></div>

    @endif

    <div class="wait-table"></div>

</div>

<div class="cover">

    <form class="student-inputs" method="post">

        <div class="title">إضافة طالب جديد</div>

        <div class="inputs">

            @csrf

            <div class="label">الاسم الأول</div>
            <input type="text" class="first-name" name="first_name">
            <div class="error">لا يمكنك ترك هذا الحقل فارغاً.</div>

            <div class="label">الاسم الأوسط</div>
            <input type="text" class="middle-name" name="middle_name">
            <div class="error">لا يمكنك ترك هذا الحقل فارغاً.</div>

            <div class="label">الاسم الأخير</div>
            <input type="text" class="last-name" name="last_name">
            <div class="error">لا يمكنك ترك هذا الحقل فارغاً.</div>

            <div class="label">الرقم الوطني</div>
            <input type="text" class="ssn" name="ssn" minlength="10" maxlength="10">
            <div class="error">لا يمكنك ترك هذا الحقل فارغاً.</div>

            <div class="label">العمر</div>
            <input type="text" class="age" name="age">
            <div class="error">لا يمكنك ترك هذا الحقل فارغاً.</div>

            <div class="label">الجنس</div>
            @include('include.list', ['type' => 'gender'])
            <div class="error">لا يمكنك ترك هذا الحقل فارغاً.</div>

            <div class="label">المدرسة</div>
            <input type="text" class="school" name="school">
            <div class="error">لا يمكنك ترك هذا الحقل فارغاً.</div>

            <div class="label">الولاية</div>
            @include('include.list', ['type' => 'state','all' => false])
            <div class="error">لا يمكنك ترك هذا الحقل فارغاً.</div>

            <div class="label">رقم الجلوس</div>
            <input type="text" class="setting-number" name="sitting_number" minlength="6" maxlength="6">
            <div class="error">لا يمكنك ترك هذا الحقل فارغاً.</div>

            <div class="label">التخصص</div>
            @include('include.list', ['type' => 'major','all' => false])
            <div class="error">لا يمكنك ترك هذا الحقل فارغاً.</div>

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

    </form>

</div>

@endsection


@section('confirm')
هل أنت متأكد من أنك تريد حذف هذا الطالب من النظام؟
@endsection


@section('js')
<script src="{{asset('js/website/admin/students.js')}}" type="module"></script>
@endsection