<div class="list-container {{ $type }}"> {{-- list container start --}}

    @switch($type)
        
        @case('state')

            {{-- If type is state --}}

            <div class="selected">

                {{-- Selected  State --}}

                <div class="open-arrow">&langle;</div>

                    @if ($all)

                        {{-- If all is true put all --}}

                        <div class="name" data-option="0">الكل</div>

                    @else

                        {{-- If all is false put first of state --}}

                        <div class="name" data-option="1">{{ STATES[0] }}</div>
                        
                    @endif

            </div>

            <div class="list">
                
                @if ($all)

                    {{-- If all is true put all option --}}

                    <div class="option" data-option="0">الكل</div>

                @endif

                {{-- Forloop on (STATES) [in routes/web] constent for put state options  --}}

                @for ($i = 0; $i < count(STATES); $i++)

                    <div class="option" data-option="{{ $i + 1 }}">{{ STATES[$i] }}</div>

                @endfor

            </div>

            @break

        @case('major')

            {{-- If type is major --}}

            <div class="selected">

                {{-- Selected option --}}

                <div class="open-arrow">&langle;</div>

                @if ($all)

                    {{-- If all true, selected option is shared --}}

                    <div class="name" data-option="0">مشترك</div>
                @else

                    {{-- If all false, selected option is first major --}}

                    <div class="name" data-option="1">علمي</div>

                @endif

            </div>

            <div class="list">

                {{-- List of options --}}
                
                @if ($all)

                    {{-- If all true, selected option is shared --}}

                    <div class="option" data-option="0">مشترك</div>

                @endif

                {{-- List of majors --}}

                <div class="option" data-option="1">علمي</div>
                <div class="option" data-option="2">أدبي</div>

            </div>

            @break

        @case('gender')

            {{-- If type is gender --}}

            <div class="selected">

                {{-- Selected option --}}

                <div class="open-arrow">&langle;</div>

                {{-- Selected option is first option [male] --}}

                <div class="name" data-option="1">ذكر</div>

            </div>

            <div class="list">

                {{-- List of options --}}

                <div class="option" data-option="1">ذكر</div>
                <div class="option" data-option="2">أنثى</div>

            </div>

            @break

    @endswitch
    
</div> {{-- list container end --}}