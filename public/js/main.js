
$(document).ready(function(){


    $('#help-knop').click(function(){
        $('#info-panel').fadeToggle('fast');
    });

    // $.ajaxSetup({
    //     headers: {
    //         'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    //     }
    // });
    // $('#soort').change(function(){
    //     var soort = $(this).val();
    //     $.ajax({
    //         url:"/home",
    //         method:"GET",
    //         dataType: 'html',
    //         data: { 'soortoption' : soort},
    //         success:function(data){
    //             alert(data);
    //         }
    //     });
    // });

    $('.input-daterange input').each(function() {
        $(this).datepicker({
            format: 'dd/mm/yyyy',
        });
    });

    $('#infobalk').slideDown('slow');

    // Bee3d slider
    var demo = document.getElementById('demo');
    var slider = new Bee3D(demo, {
        focus: 3,
        listeners: {
            keys: true,
            touches: true,
        },
        navigation: {
            enabled: true
        }
    });
});

