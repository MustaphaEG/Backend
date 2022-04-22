<header id="glo-header">
    <div class="header-wrapper">
        <div class="logo-wrapper fullH pull-r">
            <a class="logo" href="/"></a>
        </div>
        <div class="icon-wrapper fullH pull-r">
            <ul>
                <li class="pull-r">
                    <a href="{{URL::to("/")}}">
                        <div class="wrapper">
                            <label class="pull-r"></label>
                            <span class="pull-l">الرئيسية</span>
                        </div>
                    </a>
                </li>
                <li class="pull-r">
                    <a href="{{URL::to("/feed")}}">
                        <div class="wrapper">
                            <label class="pull-r"></label>
                            <span class="pull-l">اسئلة</span>
                        </div>
                    </a>
                </li>
                <li class="pull-r">
                    <a href="{{URL::to("/topic")}}">
                        <div class="wrapper">
                            <label class="pull-r"></label>
                            <span class="pull-l">مواضيع</span>
                        </div>
                    </a>
                </li>
                <li class="pull-r">
                    <a href="#">
                        <div class="wrapper">
                            <label class="pull-r"></label>
                            <span class="pull-l">اشعارات</span>
                        </div>
                    </a>
                </li>

            </ul>
        </div>
        <div class="search-bar-wrapper fullH pull-r">
            <div class="wrapper">
                <input id="glo-search" placeholder="ابحث عن اى شئ...">
            </div>
            <div id="search-result"></div>
        </div>
        <div class="other-wrapper fullH pull-r flex">
            @if(isset($idU))
            <div class="profile">
                <div class="user-image">
                    <a id="openUserHeaderList" class="avatar" style="background-image: url('{{URL::asset("/user/image/".$User->image)}}')"></a>
                </div>
                <div class="profile-pop-up list-with-arrow"> 
                    <div class="res-wrapper rtl">
                        <div class="arrow"></div>
                        <div class="ol">
                            <div id="logoutFromAccount" class="li easy-bg-color">
                                <a class="flex">
                                    <div class="icon"><img src="{{URL::asset("image/icon/ask.svg")}}"></div>
                                    <div class="title">تسجيل الخروج</div>
                                </a>
                            </div>
                            <div class="li easy-bg-color">
                                <a  href="{{URL::to("@".$User->id_url)}}"  class="flex">
                                    <div class="icon"><img src="{{URL::asset("image/icon/ask.svg")}}"></div>
                                    <div class="title">الملف الشخصى</div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ask-btn flex">
                <a href="{{URL::to("/ask")}}" class="flex add-que-btn">
                    <div class="icon">

                    </div>
                    <div class="text">
                        اضف سؤال
                    </div>
                </a>
            </div>
            @esle
            <div id="log-from-header" class="flex">
                <div class="sign-up">
                    <div class="btn-wrapper btn">
                        <a class="deco-non flex" href="{{URL::to("/signup")}}">
                            <span>انشاء حساب</span>
                        </a>
                    </div>

                </div>
                <div class="log-in">
                    <div class="btn-wrapper">
                        <a class="deco-non flex" href="{{URL::to("/login")}}">
                            <span>تسجيل الدخول</span>
                        </a>
                    </div>
                </div>
            </div>
            @endif

        </div>
    </div>
</header>