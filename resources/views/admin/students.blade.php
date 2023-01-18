
{{-- Use admin-page layout --}}

@extends('layout.admin-pages')

{{-- Assign title of page --}}

@section('title', 'الطلاب')

{{-- Add file of css in page --}}

@section('css')
    <link rel="stylesheet" href="{{asset('css/website/admin/students.css')}}">
@endsection

{{-- Add elements in container section --}}

@section('container')

    <div class="students-table"> {{-- Students table start --}}

        <div class="table-head">جدول الطلاب</div>

        {{-- Include state list-conatiner with (all) option --}}
        
        @include('include.list', ['type' => 'state','all' => true])

        {{-- Forelse to put students info --}}

        @forelse ($students as $student)

            {{-- If there's students --}}

            <div class="student"> {{-- Student element start --}}

                <div class="info-name"> {{-- info name element start --}}

                    <div class="open-arrow">&langle;</div>

                    <div class="title"> {{-- title element in student start --}}

                        <div class="name">
                            <span>{{ $student->first_name }} </span>
                            <span>{{ $student->middle_name }} </span>
                            <span>{{ $student->last_name }}</span>
                        </div>

                        {{-- Option element has edit and remove options --}}

                        <div class="options">
                            <div class="edit">
                                <div class="icon edit-icon"></div>
                            </div>
                            <div class="delete">&minus;</div>
                        </div>

                    </div> {{-- title element in student end --}}

                </div> {{-- info name element end --}}

                <div class="info"> {{-- info element start --}}

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

                </div> {{-- info element end --}}

            </div> {{-- Student element end --}}

        @empty

            {{-- If there's not students will add nothing template --}}

            <div class="nothing">
                <div class="message">لا يوجد أي طلاب مسجلين حتى الآن</div>
            </div>

        @endforelse

        {{-- Add button in table --}}

        <div class="add">&plus;</div>

        @if ($students->hasPages())

            {{-- If there's pages --}}

            <div class="pagination"> {{-- Pagination start --}}

                {{-- Previous arrow with disabled class if this is first page --}}

                <div class="prev {{ $students->currentPage() <= 1 ? 'disabled' : '' }}">&langle;</div>

                <div class="pages"> {{-- Page Start --}}

                    {{-- Current has number of current page --}}

                    <div class="current">{{ $students->currentPage() }}</div>

                    <span>/</span>

                    {{-- Pages number has number of last page --}}

                    <div class="pages-number">{{ $students->lastPage() }}</div>

                </div> {{-- Page end --}}

                {{-- Next arrow with disabled class if this is last page --}}

                <div class="next {{ $students->currentPage() >= $students->lastPage() ? 'disabled' : '' }}">&rangle;</div>

            </div> {{-- Pagination end --}}

        @else

            {{-- If there's not pages --}}

            <div class="footer-table"></div>

        @endif

        {{-- Wait element in table --}}

        <div class="wait-table"></div>

    </div> {{-- Students table end --}}

    <div class="cover"> {{-- Cover start --}}

        <form class="student-inputs" method="post"> {{-- Add student inputs start --}}

            <div class="title">إضافة طالب جديد</div>

            <div class="inputs">
                
                @csrf

                {{-- Add every input with label and error element --}}

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

                {{-- include gender list-container --}}
                
                @include('include.list', ['type' => 'gender'])

                <div class="error">لا يمكنك ترك هذا الحقل فارغاً.</div>
                <div class="label">المدرسة</div>
                <input type="text" class="school" name="school">
                <div class="error">لا يمكنك ترك هذا الحقل فارغاً.</div>
                <div class="label">الولاية</div>

                {{-- include state list-container without (all) option --}}
                
                @include('include.list', ['type' => 'state','all' => false])

                <div class="error">لا يمكنك ترك هذا الحقل فارغاً.</div>
                <div class="label">رقم الجلوس</div>
                <input type="text" class="setting-number" name="sitting_number" minlength="6" maxlength="6">
                <div class="error">لا يمكنك ترك هذا الحقل فارغاً.</div>
                <div class="label">التخصص</div>

                {{-- include major list-container without (all) option --}}
                
                @include('include.list', ['type' => 'major','all' => false])

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

        </form> {{-- Add student inputs end --}}
        
    </div> {{-- cover end --}}

@endsection

{{-- Message in confirm element --}}

@section('confirm')
    هل أنت متأكد من أنك تريد حذف هذا الطالب من النظام؟
@endsection

{{-- Add file of js in page --}}

@section('js')
    <script src="{{asset('js/website/admin/students.js')}}"></script>
@endsection