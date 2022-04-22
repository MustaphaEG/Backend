<script type="text/javascript">
    const IS_A_USER     =  @php (isset($idU) ? json_encode(true) : json_encode(false))@phpend;
    const BASE_URL      = "{{URL::to('/')}}";
    const USER_GROUP    = $User->user_group;
   // const USER_GROUP_MODER = USER_GROUP_MODER?>;
</script>