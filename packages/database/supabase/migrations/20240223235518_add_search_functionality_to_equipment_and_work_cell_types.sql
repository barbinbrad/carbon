

-- Work Cell Type Start
CREATE FUNCTION public.create_work_cell_type_search_result()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.search(name, description, entity, uuid, link)
  VALUES (new.id, new.id || ' ' || new.name || ' ' || COALESCE(new.description, ''), 'Part', new.id, '/x/resources/work-cells/' || new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_work_cell_type_search_result
  AFTER INSERT ON public."workCellType"
  FOR EACH ROW EXECUTE PROCEDURE public.create_work_cell_type_search_result();

CREATE FUNCTION public.update_work_cell_type_search_result()
RETURNS TRIGGER AS $$
BEGIN
  IF (old.name <> new.name OR old.description <> new.description) THEN
    UPDATE public.search SET name = new.name, description = new.id || ' ' || new.name || ' ' || COALESCE(new.description, '')
    WHERE entity = 'Part' AND uuid = new.id;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_work_cell_type_search_result
  AFTER UPDATE ON public."workCellType"
  FOR EACH ROW EXECUTE PROCEDURE public.update_work_cell_type_search_result();

CREATE FUNCTION public.delete_work_cell_type_search_result()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.search WHERE entity = 'Part' AND uuid = old.id;
  RETURN old;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER delete_work_cell_type_search_result
  AFTER DELETE ON public."workCellType"
  FOR EACH ROW EXECUTE PROCEDURE public.delete_work_cell_type_search_result();
-- Work Cell Type End

-- Equipment Type Start
CREATE FUNCTION public.create_equipment_type_search_result()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.search(name, description, entity, uuid, link)
  VALUES (new.id, new.id || ' ' || new.name || ' ' || COALESCE(new.description, ''), 'Part', new.id, '/x/resources/equipment/' || new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_equipment_type_search_result
  AFTER INSERT ON public."equipmentType"
  FOR EACH ROW EXECUTE PROCEDURE public.create_equipment_type_search_result();

CREATE FUNCTION public.update_equipment_type_search_result()
RETURNS TRIGGER AS $$
BEGIN
  IF (old.name <> new.name OR old.description <> new.description) THEN
    UPDATE public.search SET name = new.name, description = new.id || ' ' || new.name || ' ' || COALESCE(new.description, '')
    WHERE entity = 'Part' AND uuid = new.id;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_equipment_type_search_result
  AFTER UPDATE ON public."equipmentType"
  FOR EACH ROW EXECUTE PROCEDURE public.update_equipment_type_search_result();

CREATE FUNCTION public.delete_equipment_type_search_result()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.search WHERE entity = 'Part' AND uuid = old.id;
  RETURN old;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER delete_equipment_type_search_result
  AFTER DELETE ON public."equipmentType"
  FOR EACH ROW EXECUTE PROCEDURE public.delete_equipment_type_search_result();
-- Equipment Type End