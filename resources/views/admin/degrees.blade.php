
{{-- Use admin-page layout --}}

@extends('layout.admin-pages')

{{-- Assign title of page --}}

@section('title', 'الدرجات')

{{-- Add file of css in page --}}

@section('css')
    <link rel="stylesheet" href="{{asset('css/website/admin/degrees.css')}}">
@endsection

{{-- Add elements in container section --}}

@section('container')

    <div class="details-degrees"> {{-- Details degrees start --}}

        <div class="table-head">الدرجات بالتفصيل</div>

        {{-- Include state list-conatiner with (all) option --}}
        
        @include('include.list', ['type' => 'state','all' => true])

        <div class="details"> {{-- Details start --}}

            {{-- Forelse to put students degrees --}}

            @forelse ($degrees as $degree)

            {{-- If there's students degrees --}}

            <div class="student" data-ssn="{{ $degree->ssn }}"> {{-- Student element start --}}

                <div class="info-name"> {{-- info name element start --}}

                    <div class="open-arrow">&langle;</div>

                    <div class="title"> {{-- title element in student start --}}

                        <div class="name">
                            {{ $degree->first_name . ' ' . $degree->middle_name . ' ' . $degree->last_name }}
                        </div>

                        {{-- Option Element has edit and remove options --}}

                        <div class="options">
                            <div class="edit">
                                <div class="icon edit-icon"></div>
                            </div>
                            <div class="delete">&minus;</div>
                        </div>

                    </div> {{-- title element in student end --}}

                </div> {{-- info name element end --}}

                <div class="info"> {{-- info element start --}}

                    {{-- Foreach to add each subject degree for this student --}}

                    @foreach ($degree->degrees as $degree2)
                        <div class="name">{{ $degree2->subject->subject_name }}</div>
                        <div class="value">{{ $degree2->degree }}%</div>
                    @endforeach

                </div> {{-- info element end --}}

            </div> {{-- Student element end --}}

            @empty

                {{-- If there's not students degrees will add nothing template --}}

                <div class="nothing">
                    لا توجد درجات مسجلة حتى الآن.
                </div>

            @endforelse

        </div> {{-- Details end --}}

        {{-- Add button in table --}}

        <div class="add">&plus;</div>

        @if ($degrees->hasPages())

            {{-- If there's pages --}}

            <div class="pagination"> {{-- Pagination start --}}

                {{-- Previous arrow with disabled class if this is first page --}}

                <div class="prev {{ $degrees->currentPage() <= 1 ? 'disabled' : '' }}">&langle;</div>

                <div class="pages"> {{-- Page Start --}}

                    {{-- Current has number of current page --}}

                    <div class="current">{{ $degrees->currentPage() }}</div>

                    <span>/</span>

                    {{-- Pages number has number of last page --}}

                    <div class="pages-number">{{ $degrees->lastPage() }}</div>
                    
                </div> {{-- Page end --}}

                {{-- Next arrow with disabled class if this is last page --}}

                <div class="next {{ $degrees->currentPage() >= $degrees->lastPage() ? 'disabled' : '' }}">&rangle;</div>

            </div> {{-- Pagination end --}}

        @else

            {{-- If there's not pages --}}

            <div class="footer-table"></div>

        @endif

        {{-- Wait element table --}}

        <div class="wait-table"></div>

    </div> {{-- Details degrees end --}}

    <div class="final-degrees"> {{-- Final degrees start --}}

        <div class="table-head">درجات الطلاب</div>
        
        {{-- Include state list-container with (all) option --}}

        @include('include.list', ['type' => 'state','all' => true])
        
        <div class="degrees"> {{-- degrees start --}}

            <div class="student title">اسم الطالب</div>
            <div class="degree title">الدرجة الكلية</div>

            {{-- Forelse to put students final degrees --}}

            @forelse ($final as $degree)

                {{-- If there's students degrees --}}

                <div class="student"> {{ $degree->first_name . ' ' . $degree->middle_name . ' ' . $degree->last_name }} </div>
                <div class="degree">{{ $degree->degree }}%</div>
            @empty

                {{-- If there's noth students degrees --}}

                <div class="nothing">
                    لا يوجد درجات مسجلة حتى الآن
                </div>
            @endforelse
        </div> {{-- degrees end --}}

        @if ($final->hasPages())

        {{-- If there's pages --}}

        <div class="pagination"> {{-- Pagination Start --}}

            {{-- Previous arrow with disabled class if this is first page --}}

            <div class="prev {{ $final->currentPage() <= 1 ? 'disabled' : '' }}">&langle;</div>

            <div class="pages"> {{-- Pages start --}}

                {{-- Current element has current page number --}}

                <div class="current">{{ $final->currentPage() }}</div>

                <span>/</span>

                {{-- Pages number has last page number --}}

                <div class="pages-number">{{ $final->lastPage() }}</div>

            </div> {{-- Pages end --}}

            {{-- Next arrow with disabled class if this is last page --}}

            <div class="next {{ $final->currentPage() >= $final->lastPage() ? 'disabled' : '' }}">&rangle;</div>

        </div> {{-- Pagination end --}}

        @else

            {{-- If there's not pages --}}

            <div class="footer-table"></div>

        @endif

        {{-- Wait element in table --}}

        <div class="wait-table"></div>

    </div> {{-- Final degrees end --}}

    <div class="cover"> {{-- Cover start --}}

        <div class="add-degree"> {{-- add degree element start --}}

            <div class="table-head">أضف درجات طالب</div>

            @if ($students_without_degrees->count() > 0)

                {{-- If there's students without degrees --}}

                <div class="select-input students list-container"> {{-- students list-container start --}}

                    {{-- Set first student without degrees in selected --}}

                    <div class="selected">
                        <div class="open-arrow">&langle;</div>
                        <div class="name" data-option="{{ $students_without_degrees[0]->ssn }}">{{ $students_without_degrees[0]->first_name . ' ' . $students_without_degrees[0]->middle_name . ' ' . $students_without_degrees[0]->last_name }}</div>
                    </div>

                    <div class="list">

                        {{-- Foreach to set students without degrees in option list --}}

                        @foreach ($students_without_degrees as $student)
                            <div class="option" data-major="{{ $student->specialization }}" data-option="{{ $student->ssn }}">{{ $student->first_name . ' ' . $student->middle_name . ' ' . $student->last_name }}</div>
                        @endforeach

                    </div>

                </div> {{-- students list-container end --}}

            @endif

            <div class="degrees"> {{-- Degrees inputs start --}}

                @if ($students_without_degrees->count() > 0)

                    {{-- If there's students without degrees --}}

                    <div class="error"></div> {{-- Error element for students list-container --}}

                    @foreach ($subjects as $subject)

                        {{--
                            Foreach for each subject for first student without degrees with subject name in label and input and error element
                        --}}

                        <div class="label">{{ $subject->subject_name }}</div>
                        <input type="text" class="theDegree" data-id="{{ $subject->id }}" />
                        <div class="error"></div>

                    @endforeach
                @else

                    {{-- If there's students without degrees --}}

                    <div class="nothing">لقد تم وضع الدرجات لجميع الطلاب المسجلين في النظام حتى الآن</div>

                @endif

            </div> {{-- Degrees inputs end --}}
            
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

        </div> {{-- add degree element end --}}

    </div> {{-- Cover end --}}

@endsection

{{-- Message in confirm element --}}

@section('confirm')
    هل أنت متأكد من أنك تريد حذف هذه الدرجات من النظام؟
@endsection

{{-- Add file of js in page --}}

@section('js')
    <script src="{{asset('js/website/admin/degrees.js')}}"></script>
@endsection