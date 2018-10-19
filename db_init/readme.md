# 数据库说明
+ 用户
  + 用户名 ： `everkeep`
  + 密&emsp;码 ： `everkeep_team10`
  + 权&emsp;限 ：  `all on everkeep.*`

+ 数据库结构
  +  **所有的 `tablenameid` 均设置了外键，下表中没有指明**
  + `everkeep.user`

    | Field      | Type      | Null | Key | Default           | Extra          |
    |------------|:---------:|:----:|:---:|:-----------------:|----------------|
    | userid     | int(11)   | NO   | PRI | NULL              | auto_increment |
    | username   | text      | YES  |     | NULL              | unique         |
    | password   | text      | NO   |     | NULL              |                |
    | email      | text      | NO   |     | NULL              | unique         |
    | createTime | timestamp | NO   |     | CURRENT_TIMESTAMP |                |

  + `everkeep.note`

    | Field        | Type       | Null | Key | Default             | Extra                      |
    |--------------|:----------:|:----:|:---:|:-------------------:|----------------------------|
    | noteid       | int(11)    | NO   | PRI | NULL                | auto_increment |
    | userid       | int(11)    | NO   | MUL | NULL                |                            |
    | title        | text       | YES  |     | NULL                |                            |
    | content      | longtext       | NO   |     | NULL                |                            |
    | createTime   | timestamp  | NO   |     | CURRENT_TIMESTAMP   |                            |
    | updateTime   | timestamp  | NO   |     | CURRENT_TIMESTAMP   | on update CURRENT_TIMESTAMP|
    | markid       | int(11)    | YES  | MUL | NULL                |                            |
    | notebookid   | int(11)    | YES  | MUL | NULL                |                            |
    | remindTime   | timestamp  | NO   |     | 0000-00-00 00:00:00 |                            |
    | isStar      | tinyint(4) | NO   |     | 0                |                            |
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
    | isStar    | tinyint(4) | NO   |     | 0              |                             |
    | isDelete   | tinyint(4) | YES  |     | 0                 |                             |

  + `everkeep.notebook`

    | Field        | Type       | Null | Key | Default           | Extra                       |
    |:------------:|:----------:|:----:|:---:|:-----------------:|:---------------------------:|
    | notebookid   | int(11)    | NO   | PRI | NULL              | auto_increment |
    | userid       | int(11)    | NO   | MUL | NULL              |                             |
    | bookName     | text       | NO   |     | NULL              |                             |
    | createTime   | timestamp  | NO   |     | CURRENT_TIMESTAMP |                             |
    | updateTime   | timestamp  | NO   |     | CURRENT_TIMESTAMP | on update CURRENT_TIMESTAMP |
    | noteNumber   | int(11)    | NO   |     | 0                 |                             |
    | isStar      | tinyint(4) | NO   |     | 0              |                             |
    | isShare      | tinyint(4) | YES  |     | 0                 |                             |
    | isDelete     | tinyint(4) | YES  |     | 0                 |                             |
    | sharedPeople | text       | YES  |     | NULL              |                             |

  + `everkeep.comment`
  
    | Field     | Type    | Null | Key | Default | Extra |
    |-----------|:-------:|:----:|:---:|:-------:|:-----:|
    | commentid | int(11) | NO   | PRI | NULL    | auto_increment |
    | userid    | int(11) | NO   | MUL | NULL    |       |
    | noteid    | int(11) | NO   | MUL | NULL    |       |
    | content   | text    | NO   |     | NULL    |       |
    | filename  | text    | YES  |     | NULL    |       |
    | ext       | text    | YES  |     | NULL    |       |
    | type      | text    | YES  |     | NULL    |       |
    | filepath  | text    | YES  |     | NULL    |       |

  + `everkeep.file`

    | Field        | Type        | Null | Key | Default | Extra |
    |--------------|:-----------:|:----:|:---:|:-------:|:-----:|
    | fileid       | varchar(32) | NO   | PRI | NULL    |       |
    | userid       | int(11)     | NO   | MUL | NULL    |       |
    | filename     | text        | NO   |     | NULL    |       |
    | filesize     | int(11)     | NO   |     | NULL    |       |
    | filedata     | longblob    | NO   |     | NULL    |       |
    | link         | int(11)     | YES  |     | 1       |       |