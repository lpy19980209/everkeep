# 数据库说明
+ 用户
  + 用户名 ： `everkeep`
  + 密&emsp;码 ： `everkeep`
  + 权&emsp;限 ：  `all`

+ 数据库结构
  +  **所有的 `tablenameid` 均设置了外键，下表中没有指明**
  + `everkeep.user`

    | Field      | Type      | Null | Key | Default           | Extra          |
    |------------|:---------:|:----:|:---:|:-----------------:|----------------|
    | userid     | int(11)   | NO   | PRI | NULL              | auto_increment |
    | username   | text      | YES  |     | NULL              |                |
    | password   | text      | NO   |     | NULL              |                |
    | email      | text      | NO   |     | NULL              |                |
    | createTime | timestamp | NO   |     | CURRENT_TIMESTAMP |                |

  + `everkeep.note`

    | Field        | Type       | Null | Key | Default             | Extra                      |
    |--------------|:----------:|:----:|:---:|:-------------------:|----------------------------|
    | noteid       | int(11)    | NO   | PRI | NULL                |                            |
    | userid       | int(11)    | NO   | MUL | NULL                |                            |
    | content      | text       | NO   |     | NULL                |                            |
    | createTime   | timestamp  | NO   |     | CURRENT_TIMESTAMP   |                            |
    | updateTime   | timestamp  | NO   |     | CURRENT_TIMESTAMP   | on update CURRENT_TIMESTAMP|
    | markid       | int(11)    | YES  | MUL | NULL                |                            |
    | notebookid   | int(11)    | YES  | MUL | NULL                |                            |
    | remindTime   | timestamp  | NO   |     | 0000-00-00 00:00:00 |                            |
    | isStart      | tinyint(4) | NO   |     | NULL                |                            |
    | isShare      | tinyint(4) | YES  |     | 0                   |                            |
    | isDelete     | tinyint(4) | YES  |     | 0                   |                            |
    | sharedPeople | text       | YES  |     | NULL                |                            |  
  + `everkeep.mark`

    | Field      | Type       | Null | Key | Default           | Extra                       |
    |------------|:----------:|:----:|:---:|:-----------------:|:---------------------------:|
    | markid     | int(11)    | NO   | PRI | NULL              | auto_increment              |
    | userid     | int(11)    | NO   | MUL | NULL              |                             |
    | markName   | text       | NO   |     | NULL              |                             |
    | createTime | timestamp  | NO   |     | CURRENT_TIMESTAMP |                             |
    | updateTime | timestamp  | NO   |     | CURRENT_TIMESTAMP | on update CURRENT_TIMESTAMP |
    | isStart    | tinyint(4) | NO   |     | NULL              |                             |
    | isDelete   | tinyint(4) | YES  |     | 0                 |                             |

  + `everkeep.notebook`

    | Field        | Type       | Null | Key | Default           | Extra                       |
    |:------------:|:----------:|:----:|:---:|:-----------------:|:---------------------------:|
    | notebookid   | int(11)    | NO   | PRI | NULL              |                             |
    | userid       | int(11)    | NO   | MUL | NULL              |                             |
    | bookName     | text       | NO   |     | NULL              |                             |
    | createTime   | timestamp  | NO   |     | CURRENT_TIMESTAMP |                             |
    | updateTime   | timestamp  | NO   |     | CURRENT_TIMESTAMP | on update CURRENT_TIMESTAMP |
    | noteNumber   | int(11)    | NO   |     | 0                 |                             |
    | isStart      | tinyint(4) | NO   |     | NULL              |                             |
    | isShare      | tinyint(4) | YES  |     | 0                 |                             |
    | isDelete     | tinyint(4) | YES  |     | 0                 |                             |
    | sharedPeople | text       | YES  |     | NULL              |                             |

  + `everkeep.comment`
  
    | Field     | Type    | Null | Key | Default | Extra |
    |-----------|:-------:|:----:|:---:|:-------:|:-----:|
    | commentid | int(11) | NO   | PRI | NULL    |       |
    | userid    | int(11) | NO   | MUL | NULL    |       |
    | noteid    | int(11) | NO   | MUL | NULL    |       |
    | content   | text    | NO   |     | NULL    |       |
    | filename  | text    | YES  |     | NULL    |       |
    | ext       | text    | YES  |     | NULL    |       |
    | type      | text    | YES  |     | NULL    |       |
    | filepath  | text    | YES  |     | NULL    |       |