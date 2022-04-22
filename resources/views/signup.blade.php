<html lang="ar">
    <head>
        <title>يُجيب  - انشاء حساب</title>
        @include("template.css")
        <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "انشاء حساب",
                "item": "{{URL::to('signup')}}"
              }]
            }
            </script>
    </head>
    <body id="logPage">
        <div id="over-layer" class="hidden dir">
            <div id="alert-top-tip-wrapper"></div>
        </div>
        @include("template.header")
        <div id="form-container">
            <div class="login-page">
                <div class="form-login">
                    <div class="logo-wrapper">
                        <div class="logo">
                            <img src="{{URL::asset('image/logo/logo.svg')}}"/>
                        </div>
                    </div>
                    
                    <div class="input-wrapper">
                        <div class="input-unit">
                            <input id="user-name" class="input" type="text" data-max-length="36" placeholder="username">
                            <div class="max-num"><label>0</label><span>/36</span></div>
                        </div>
                        <div class="input-unit">
                            <input id="user-email" class="input"  type="text" data-max-length="64" placeholder="email">
                            <div class="max-num"><label>0</label><span>/64</span></div>
                        </div>
                        <div class="input-unit">
                            <input id="user-password" class="input" type="password" data-max-length="50" placeholder="password">
                            <div class="max-num"><label>0</label><span>/50</span></div>
                        </div>
                        
                        <div class="input-unit">
                            <input id="password-confirm"  class="input" type="password" data-max-length="50" placeholder="confirm password">
                            <div class="max-num"><label>0</label><span>/50</span></div>
                        </div>
                    </div>
                    
                    <div class="have-no-acc">
                        <div class="wrapper">
                            <h1>
                                <span> لديك حساب؟ </span><a href="{{URL::to('/login')}}">سجل دخول</a>
                            </h1>
                        </div>
                    </div>
                    <div class="log-in-with">
                        <div class="unit-logo easy-bg-color" style="background-image: url('{{URL::asset('image/icon/social/019-quora.svg')}}')"></div>
                        <div class="unit-logo easy-bg-color" style="background-image: url('{{URL::asset('image/icon/social/026-medium.svg')}}"></div>
                        <div class="unit-logo easy-bg-color" style="background-image: url('{{URL::asset('image/icon/social/033-google-plus.svg')}}"></div>
                        <div class="unit-logo easy-bg-color" style="background-image: url('{{URL::asset('image/icon/social/036-facebook.svg')}}"></div>
                        <div class="unit-logo easy-bg-color" style="background-image: url('{{URL::asset('image/icon/social/004-wikipedia.svg')}}"></div>
                    </div>
                    <button id="sign-up-btn">انشاء حساب</button>

                </div>
            </div>
        </div>
        <div id="over-layer-wrapper"></div>
        @include("template.js")
        <script src="{{URL::asset('js/lib/jquery-3.2.1.min.js')}}"></script>
        <script src="{{URL::asset('js/lib/base.js')}}"></script>
        <script src="{{URL::asset('js/user.js')}}"></script>
        <script src="{{URL::asset('js/signup.js')}}"></script>
    </body>
</html>
