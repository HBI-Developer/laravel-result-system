<div class="list-container {{ $type }}"> 

    @switch($type)
        
        @case('state')

            <div class="selected">

                <div class="open-arrow">&langle;</div>

                    @if ($all)

                        <div class="name" data-option="0">الكل</div>

                    @else

                        <div class="name" data-option="1">{{ STATES[0] }}</div>
                        
                    @endif

            </div>

            <div class="list">
                
                @if ($all)

                    <div class="option" data-option="0">الكل</div>

                @endif

                @for ($i = 0; $i < count(STATES); $i++)

                    <div class="option" data-option="{{ $i + 1 }}">{{ STATES[$i] }}</div>

                @endfor

            </div>

            @break

        @case('major')

            <div class="selected">

                <div class="open-arrow">&langle;</div>

                @if ($all)

                    <div class="name" data-option="0">مشترك</div>

                @else

                    <div class="name" data-option="1">علمي</div>

                @endif

            </div>

            <div class="list">
                
                @if ($all)

                    <div class="option" data-option="0">مشترك</div>

                @endif

                <div class="option" data-option="1">علمي</div>

                <div class="option" data-option="2">أدبي</div>

            </div>

            @break

        @case('gender')

            <div class="selected">

                <div class="open-arrow">&langle;</div>

                <div class="name" data-option="1">ذكر</div>

            </div>

            <div class="list">

                <div class="option" data-option="1">ذكر</div>
                
                <div class="option" data-option="2">أنثى</div>

            </div>

            @break

    @endswitch
    
</div> 