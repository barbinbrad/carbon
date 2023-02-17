-- xid is a globally unique id generator functions. 
-- they are 20 characters long and ordered
-- https://github.com/modfin/pg-xid

CREATE DOMAIN public.xid AS CHAR(20) CHECK (VALUE ~ '^[a-v0-9]{20}$');

CREATE SEQUENCE IF NOT EXISTS public.xid_serial MINVALUE 0 MAXVALUE 16777215 CYCLE; --  ((255<<16) + (255<<8) + 255))

SELECT setval('xid_serial', (random() * 16777215)::INT); --  ((255<<16) + (255<<8) + 255))

CREATE OR REPLACE FUNCTION public._xid_machine_id()
    RETURNS INT
    LANGUAGE plpgsql
    IMMUTABLE
AS
$$
DECLARE
BEGIN
    RETURN (SELECT system_identifier & 16777215 FROM pg_control_system());
END
$$;

CREATE OR REPLACE FUNCTION public.xid_encode(_id int[])
    RETURNS public.xid
    LANGUAGE plpgsql
AS
$$
DECLARE
    _encoding CHAR(1)[] = '{0, 1, 2, 3, 4, 5, 6, 7, 8, 9, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v}';
BEGIN
    RETURN _encoding[1 + (_id[1] >> 3)]
               || _encoding[1 + ((_id[2] >> 6) & 31 | (_id[1] << 2) & 31)]
               || _encoding[1 + ((_id[2] >> 1) & 31)]
               || _encoding[1 + ((_id[3] >> 4) & 31 | (_id[2] << 4) & 31)]
               || _encoding[1 + (_id[4] >> 7 | (_id[3] << 1) & 31)]
               || _encoding[1 + ((_id[4] >> 2) & 31)]
               || _encoding[1 + (_id[5] >> 5 | (_id[4] << 3) & 31)]
               || _encoding[1 + (_id[5] & 31)]
               || _encoding[1 + (_id[6] >> 3)]
               || _encoding[1 + ((_id[7] >> 6) & 31 | (_id[6] << 2) & 31)]
               || _encoding[1 + ((_id[7] >> 1) & 31)]
               || _encoding[1 + ((_id[8] >> 4) & 31 | (_id[7] << 4) & 31)]
               || _encoding[1 + (_id[9] >> 7 | (_id[8] << 1) & 31)]
               || _encoding[1 + ((_id[9] >> 2) & 31)]
               || _encoding[1 + ((_id[10] >> 5) | (_id[9] << 3) & 31)]
               || _encoding[1 + (_id[10] & 31)]
               || _encoding[1 + (_id[11] >> 3)]
               || _encoding[1 + ((_id[12] >> 6) & 31 | (_id[11] << 2) & 31)]
               || _encoding[1 + ((_id[12] >> 1) & 31)]
        || _encoding[1 + ((_id[12] << 4) & 31)];
END;
$$;

CREATE OR REPLACE FUNCTION public.xid_decode(_xid public.xid)
    RETURNS int[]
    LANGUAGE plpgsql
AS
$$
DECLARE
    _dec int[] = '{255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255}';
    _b   bytea;
BEGIN
    _b := _xid::BYTEA;
    return ARRAY [
            ((_dec[get_byte(_b, 0)] << 3) | (_dec[get_byte(_b, 1)] >> 2)) & 255,
            ((_dec[get_byte(_b, 1)] << 6) | (_dec[get_byte(_b, 2)] << 1) | (_dec[get_byte(_b, 3)] >> 4)) & 255,
            ((_dec[get_byte(_b, 3)] << 4) | (_dec[get_byte(_b, 4)] >> 1)) & 255,
            ((_dec[get_byte(_b, 4)] << 7) | (_dec[get_byte(_b, 5)] << 2) | (_dec[get_byte(_b, 6)] >> 3)) & 255,
        ((_dec[get_byte(_b, 6)] << 5) | (_dec[get_byte(_b, 7)])) & 255,
            ((_dec[get_byte(_b, 8)] << 3) | (_dec[get_byte(_b, 9)] >> 2)) & 255,
            ((_dec[get_byte(_b, 9)] << 6) | (_dec[get_byte(_b, 10)] << 1) | (_dec[get_byte(_b, 11)] >> 4)) & 255,
            ((_dec[get_byte(_b, 11)] << 4) | (_dec[get_byte(_b, 12)] >> 1)) & 255,
            ((_dec[get_byte(_b, 12)] << 7) | (_dec[get_byte(_b, 13)] << 2) | (_dec[get_byte(_b, 14)] >> 3)) & 255,
        ((_dec[get_byte(_b, 14)] << 5) | (_dec[get_byte(_b, 15)])) & 255,
            ((_dec[get_byte(_b, 16)] << 3) | (_dec[get_byte(_b, 17)] >> 2)) & 255,
            ((_dec[get_byte(_b, 17)] << 6) | (_dec[get_byte(_b, 18)] << 1) | (_dec[get_byte(_b, 19)] >> 4)) & 255
        ];
END;
$$;

CREATE OR REPLACE FUNCTION xid(_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)
    RETURNS public.xid
    LANGUAGE plpgsql
AS
$$
DECLARE
    _t INT;
    _m INT;
    _p INT;
    _c INT;
BEGIN
    _t := floor(EXTRACT(epoch FROM _at));
    _m := _xid_machine_id();
    _p := pg_backend_pid();
    _c := nextval('xid_serial')::INT;

    return public.xid_encode(ARRAY [
        (_t >> 24) & 255, (_t >> 16) & 255, (_t >> 8) & 255 , _t & 255,
        (_m >> 16) & 255, (_m >> 8) & 255 , _m & 255,
        (_p >> 8) & 255, _p & 255,
        (_c >> 16) & 255, (_c >> 8) & 255 , _c & 255
        ]);
END;
$$;

CREATE OR REPLACE FUNCTION public.xid_time(_xid public.xid)
    RETURNS TIMESTAMPTZ
    LANGUAGE plpgsql
AS
$$
DECLARE
    _id int[];
BEGIN
    _id := public.xid_decode(_xid);
    return to_timestamp((_id[1] << 24)::BIGINT + (_id[2] << 16) + (_id[3] << 8) + (_id[4]));
END;
$$;

CREATE OR REPLACE FUNCTION public.xid_machine(_xid public.xid)
    RETURNS INT[]
    LANGUAGE plpgsql
AS
$$
DECLARE
    _id int[];
BEGIN
    _id := public.xid_decode(_xid);
    return ARRAY [_id[5], _id[6], _id[7]];
END;
$$;

CREATE OR REPLACE FUNCTION public.xid_pid(_xid public.xid)
    RETURNS INT
    LANGUAGE plpgsql
AS
$$
DECLARE
    _id int[];
BEGIN
    _id := public.xid_decode(_xid);
    return (_id[8] << 8) + (_id[9]);
END;
$$;

CREATE OR REPLACE FUNCTION public.xid_counter(_xid public.xid)
    RETURNS INT
    LANGUAGE plpgsql
AS
$$
DECLARE
    _id int[];
BEGIN
    _id := public.xid_decode(_xid);
    return (_id[10] << 16) + (_id[11] << 8) + (_id[12]);
END;
$$;