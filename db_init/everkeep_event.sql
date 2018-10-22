use everkeep;

create event everkeep_clear_password_reset_code_outdate
on schedule
every 1 second
do delete from confirm where `usage`=2 and current_timestamp-applyTime>00000000003000;

create event everkeep_clear_account_confirm_code_outdate
on schedule
every 1 second
do delete from confirm where `usage`=1 and current_timestamp-applyTime>00000000235959;

create event everkeep_clear_user_outdate
on schedule
every 1 second
do delete from user where current_timestamp-createTime>00000000240000 and isConfirm=0;

create event everkeep_clear_note_outdate
on schedule
every 1 second
do delete from note where current_timestamp-updateTime>00000030000000 and isDelete=1;