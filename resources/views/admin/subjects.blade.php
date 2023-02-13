


@extends('layout.admin-pages')



@section('title', 'المقررات الدراسية')



@section('css')
    <link rel="stylesheet" href="{{asset('css/website/admin/subjects.css')}}">
@endsection

@section('container')

    <div class="subjects-table"> 

        <div class="table-head">المواد الدراسية</div>

        <div class="column title">

            <div class="subject">المادة</div>

            <div class="major">التخصص</div>

        </div>

        @forelse ($subjects as $subject)

            <div class="column">

                <div class="subject" data-id="{{ $subject->id }}"> {{ $subject->subject_name }} </div>

                <div class="major">

                    <div class="name"> {{ $subject->specialization }} </div>

                    <div class="options">

                        <div class="edit">

                            <div class="icon edit-icon"></div>

                        </div>

                        <div class="delete">&minus;</div>

                    </div>

                </div>

            </div>

        @empty

            <div class="nothing">
                لا توجد أي مواد مضافة حتى الآن.
            </div>

        @endforelse

        <div class="add">&plus;</div>

        <div class="footer-table"></div>

        <div class="wait-table"></div>

    </div> 

    <div class="cover"> 

        <div class="add-subject"> 

            <div class="table-head">أضف مادة</div>

            <div class="inputs">

                <div class="label">المادة</div>
                <input type="text" class="subject" name="subject_name">
                <div class="error">لا يمكنك ترك هذا الحقل فارغاً.</div>

                <div class="label">النخصص</div>
                @include('include.list', ['type' => 'major','all' => true])
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

        </div> 

    </div> 

@endsection



@section('confirm')
    هل أنت متأكد من حذف هذا المقرر؟
@endsection



@section('js')
    <script src="{{asset('js/website/admin/subjects.js')}}"></script>
@endsection