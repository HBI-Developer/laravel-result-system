
{{-- Use admin-page layout --}}

@extends('layout.admin-pages')

{{-- Assign title of page --}}

@section('title', 'المقررات الدراسية')

{{-- Add file of css in page --}}

@section('css')
    <link rel="stylesheet" href="{{asset('css/website/admin/subjects.css')}}">
@endsection

{{-- Add elements in container section --}}

@section('container')

    <div class="subjects-table"> {{-- subject table start --}}

        <div class="table-head">المواد الدراسية</div>

        {{-- Table head --}}

        <div class="column title">
            <div class="subject">المادة</div>
            <div class="major">التخصص</div>
        </div>

        {{-- Forelse to put subjects --}}

        @forelse ($subjects as $subject)

        {{-- If there's subjects --}}

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

            {{-- If there's not subjects will add nothing template --}}
        
            <div class="nothing">
                لا توجد أي مواد مضافة حتى الآن.
            </div>

        @endforelse

        {{-- Add button in table --}}

        <div class="add">&plus;</div>

        {{-- Footer of table --}}

        <div class="footer-table"></div>

        {{-- Wait element in table --}}

        <div class="wait-table"></div>

    </div> {{-- subject table end --}}

    <div class="cover"> {{-- Cover start --}}

        <div class="add-subject"> {{-- Add subject inputs start --}}

            <div class="table-head">أضف مادة</div>

            <div class="inputs">

                {{-- Add every input with label and error element --}}

                <div class="label">المادة</div>
                <input type="text" class="subject" name="subject_name">
                <div class="error">لا يمكنك ترك هذا الحقل فارغاً.</div>
                <div class="label">النخصص</div>

                {{-- include major list-container with (all) option --}}

                @include('include.list', ['type' => 'major','all' => true])

                <div class="error">لا يمكنك ترك هذا الحقل فارغاً.</div>

            </div>

            <div class="buttons"> {{-- Buttons container start --}}

                {{-- Send button with waiting element (dots) --}}

                <div class="send">
                    <p>إرسال البيانات</p>
                    <div class="dots">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>

                <div class="cancel">إلغاء الأمر</div>

            </div> {{-- Buttons container end --}}

        </div> {{-- Add subject inputs end --}}

    </div> {{-- Cover end --}}

@endsection

{{-- Message in confirm element --}}

@section('confirm')
    هل أنت متأكد من حذف هذا المقرر؟
@endsection

{{-- Add file of js in page --}}

@section('js')
    <script src="{{asset('js/website/admin/subjects.js')}}"></script>
@endsection