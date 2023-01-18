<div class="header">
    
    <div class="logo">

        <div class="icon logo-icon"></div>

    </div>

    <div class="welcome">

        <span>مرحباً بك مجدداً، </span>

        <span class="username">{{
            Auth::guard('admin')->check() ? 
            Auth::guard('admin')->user()->username : 
            Auth::guard('student')->user()->first_name
        }}</span>

    </div>

    <a href="{{
        Auth::guard('admin')->check() ?
        route('admin.logout') :
        route('student.logout')
    }}" class="logout">تسجيل الخروج</a>
    
</div>