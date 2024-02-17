<?=
'<?xml version="1.0" encoding="UTF-8"?>'
?>
<promociones>
    <?php
    foreach($promociones as $row):
    ?>
        <promocion>
            <?php
            foreach($row as $campo => $dato):
                $valor = is_numeric($dato)?
                number_format($dato, $campo=="precio"?2:0)
                : $dato;
            ?>
            <<?= $campo?>><?=$valor?></<?=$campo?>>
            <?php
            endforeach;
            ?>
        </promocion>
    <?php
    endforeach;
    ?>
</promociones>